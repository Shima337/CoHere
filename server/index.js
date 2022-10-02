const path = require("path");
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3003;
const app = express();
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

const cohere = require("cohere-ai");
cohere.init("yourKey");

app.get("/api", async (req, res) => {
  (async () => {
    const response = await cohere.generate({
      prompt: `Person name: Maksim
      Place of education: Belarussian Technical University
      Education degree: Bachelor's degree in Economics
      Place of work: Fetti
      Position: Product director
      Responsibilities: Creating product requirements documents, guiding other product leaders, and leading all product initiatives.
      Achievements: Attracted 1,000 users to the new mobile app, expanding the geographical area of interaction.
      Personal biography paragraph: I'm Maksim a Belarussian-born entrepreneur and technology executive who has co-founded and led several successful startups. I have a Bachelor's degree in Economics from Belarusian Technical University and extensive experience in building teams, organizing processes, and project management, including cross-team collaboration. I am passionate about using technology to solve problems and improve people's lives. My latest venture is Fetti, a mobile app for tourists and nomads. I consider myself a gifted leader and problem-solver who has a proven track record of success.
      --
      Person name: Antony
      Place of education: Cambridge University
      Education degree: MBA
      Place of work: Apple
      Position: Marketing Manager
      Responsibilities: Lead digital marketing strategy
      Achievements: MQL + 20%, Brand awareness +15%
      Personal biography paragraph:`,
      max_tokens: 250,
      temperature: 0.5,
      k: 0,
      p: 0.75,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop_sequences: [],
      return_likelihoods: "NONE",
    });
    console.log(`Prediction: ${response.body.generations[0].text}`);
    console.log(`All: ${response.body.generations}`);
  })();
});
