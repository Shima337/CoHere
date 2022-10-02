import { useEffect } from "react";
import { useState } from "react";
import "./index.css";

//const cohere = require("cohere-ai");
const URL = "http://127.0.0.1:5000";

function App() {
  const [response, setResponse] = useState();
  const [linkedin, SetLinkedin] = useState("");
  const [firstName, setFirstName] = useState("");
  const [placeOfStady, setPlaceOfStady] = useState("");
  const [degree, setDegree] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [achievements, setAchievements] = useState("");
  const [finalText, setFinalText] = useState("");

  //cohere.init("j9fltyvpID3YyH82yoUqSCjhcydpMh1vG3lLS83z");

  /*
  async () => {
    cohere.init("j9fltyvpID3YyH82yoUqSCjhcydpMh1vG3lLS83z");

    // Hit the `generate` endpoint on the `large` model
    const generateResponse = await cohere.generate({
      model: "large",
      prompt: "Once upon a time in a magical land called",
      max_tokens: 50,
      temperature: 1,
    });
    console.log(generateResponse);
  };

  */

  return (
    <div>
      <h2>creating a document stage 1</h2>
      <div className="LinkedInLink">
        LinkedIn{" "}
        <input
          value={linkedin}
          onChange={(e) => SetLinkedin(e.target.value)}
        ></input>{" "}
        <button
          onClick={() => {
            fetch(`${URL}/dev/parse`, {
              // Adding method type
              method: "POST",
              // Adding body or contents to send
              body: JSON.stringify({
                link: linkedin,
              }),

              // Adding headers to the request
              headers: {
                "Content-type": "application/json; charset=UTF-8",
              },
            })
              .then((resp) => resp.json())
              .then((res) => {
                setResponse(res);
                console.log(res);
                setFirstName(res?.first_name || "-----");

                setDegree(res?.study?.degreeName || "-----");
                setCompany(res?.company.companyName || "-----");
                setPosition(res?.position || "-----");
                setResponsibilities(res?.responsibilities[0] || "-----");
                setAchievements(res?.achievements || "-----");
                setPlaceOfStady(res?.study?.schoolName || "-----");
              });
          }}
        >
          parse LinkedIn
        </button>
      </div>

      <form>
        <div>
          <label>Who:</label>
          <input
            id="1"
            className={firstName == "-----" ? "parseData red" : "parseData"}
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              console.log(firstName);
            }}
          ></input>
        </div>

        <div>
          <label>Place of study:</label>
          <input
            id="3"
            className={placeOfStady == "-----" ? "parseData red" : "parseData"}
            value={placeOfStady}
            onChange={(e) => setPlaceOfStady(e.target.value)}
          ></input>
        </div>
        <div>
          <label>Degree:</label>
          <input
            id="4"
            className={degree == "-----" ? "parseData red" : "parseData"}
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
          ></input>
        </div>
        <div>
          <label>Company:</label>
          <input
            id="5"
            className={company == "-----" ? "parseData red" : "parseData"}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          ></input>
        </div>
        <div>
          <label>Position:</label>
          <input
            id="6"
            className={position == "-----" ? "parseData red" : "parseData"}
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          ></input>
        </div>
        <div>
          <label>Responsibilities:</label>
          <input
            id="7"
            className={
              responsibilities == "-----" ? "parseData red" : "parseData"
            }
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
          ></input>
        </div>
        <div>
          <label>Achievements:</label>
          <input
            id="8"
            className={achievements == "-----" ? "parseData red" : "parseData"}
            value={achievements}
            onChange={(e) => setAchievements(e.target.value)}
          ></input>
        </div>
        <button
          className="CreateCoverLetter"
          onClick={(e) => {
            e.preventDefault();
            const prompt =
              "Person name: " +
              firstName +
              "," +
              "Place of education: " +
              placeOfStady +
              "," +
              "Education degree: " +
              degree +
              "," +
              "Place of work: " +
              company +
              "," +
              "Position:  " +
              position +
              "," +
              "Responsibilities: " +
              responsibilities +
              "," +
              "Achievements: " +
              achievements;

            console.log(prompt);

            fetch(`${URL}/dev/cohere`, {
              // Adding method type
              method: "POST",

              // Adding body or contents to send
              body: JSON.stringify({
                person_info: prompt,
              }),

              // Adding headers to the request
              headers: {
                "Content-type": "application/json; charset=UTF-8",
              },
            })
              .then((res) => res.json())
              .then((res) => {
                console.log(res);
                setFinalText(res.response);
              });
          }}
        >
          Generate a document
        </button>
      </form>
      <textarea
        value={finalText}
        onChange={(e) => {
          setFinalText(e.target.value);
        }}
      ></textarea>
    </div>
  );
}

export default App;
/*Who: I
Pronoun: He
Place of study: Cambridge University
Degree: MBA
Company: Apple
Position: Marketing Manager
Responsibilities: Lead digital marketing strategy
Achievements: MQL + 20%, Brand awareness +15%*/
