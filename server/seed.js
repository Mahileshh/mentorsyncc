
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Student = require("./models/Student");
const MentorStudent = require("./models/MentorStudent");

 const rawData = [
    "3	III	7376232CB103	ARUN RAJAN N M	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Mr. CHANDRU K S CSBS	600.00",
    "4	III	7376232CB104	ASHWIN S	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Mr. CHANDRU K S CSBS	536.00",
    "5	III	7376232CB105	BHARATHKUMAR N	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Mr. CHANDRU K S CSBS	300.00",
    "6	III	7376232CB107	DANUSREE K	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Mr. CHANDRU K S CSBS	2,219.00",
    "7	III	7376232CB108	DHANUSRI M	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Mr. CHANDRU K S CSBS	1,036.00",
    "8	III	7376232CB109	DHARNESH K	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Mr. CHANDRU K S CSBS	1,412.00",
    "9	III	7376232CB111	DHARSHA M P	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Mr. CHANDRU K S CSBS	(100.00)",
    "10	III	7376232CB112	DHARSHANA M	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Mr. CHANDRU K S CSBS	1,491.00",
    "11	III	7376232CB113	DHARSHINI S	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Mr. CHANDRU K S CSBS	1,341.00",
    "12	III	7376232CB114	DHARUN B	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Mr. CHANDRU K S CSBS	422.00",
    "13	III	7376232CB115	DHARUNKUMAR M	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Mr. CHANDRU K S CSBS	922.00",
    "14	III	7376232CB116	DHURAI MURUGAN B	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Mr. CHANDRU K S CSBS	506.00",
    "15	III	7376232CB117	FIRZAAN I	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Mr. CHANDRU K S CSBS	272.00",
    "16	III	7376232CB118	GOWRI SHANKAR P	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Mr. CHANDRU K S CSBS	2,261.00",
    "17	III	7376232CB119	HARI HARA SUDHAN N	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Mr. CHANDRU K S CSBS	1,163.00",
    "18	III	7376232CB120	HARIHARAN A	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Mr. CHANDRU K S CSBS	5.00",
    "19	III	7376232CB121	HARIHARAN K	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Dr. PADMASHREE A AIML	5.00",
    "20	III	7376232CB122	HARSITA S	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Dr. PADMASHREE A AIML	511.00",
    "21	III	7376232CB124	KARTHIKA P	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Dr. PADMASHREE A AIML	588.00",
    "22	III	7376232CB125	KARTHIKEYAN M	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Dr. PADMASHREE A AIML	10.00",
    "23	III	7376232CB126	KAVIPRIYA P	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Dr. PADMASHREE A AIML	1,550.00",
    "24	III	7376232CB127	KRISHNAPRASATH S K	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Dr. PADMASHREE A AIML	707.00",
    "25	III	7376232CB128	LEELADEVI A	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Dr. PADMASHREE A AIML	1,196.00",
    "26	III	7376232CB129	MAHILESH A	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Dr. PADMASHREE A AIML	1,101.00",
    "27	III	7376232CB130	MANMATHAN S	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Dr. PADMASHREE A AIML	0.00",
    "28	III	7376232CB131	MITHRA VINDA S	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Dr. PADMASHREE A AIML	504.00",
    "29	III	7376232CB132	MOHANA SUNDHARI M	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Dr. PADMASHREE A AIML	1,772.00",
    "30	III	7376232CB134	NITHESHAA R	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Dr. PADMASHREE A AIML	1.00",
    "31	III	7376232CB135	PEER SHEIK ABDULLAH MOHD NOORDEEN	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Dr. PADMASHREE A AIML	4.00",
    "32	III	7376232CB136	PRANAV BALAJI P MA	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Dr. PADMASHREE A AIML	788.00",
    "33	III	7376232CB137	PRANAV KARTHICK S K	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Dr. PADMASHREE A AIML	121.00",
    "34	III	7376232CB139	RAJAGOPAL S	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Dr. PADMASHREE A AIML	1,515.00",
    "35	III	7376232CB140	SACHIN SURESH	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Dr. PADMASHREE A AIML	1,050.00",
    "36	III	7376232CB141	SANJAY C	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Dr. PADMASHREE A AIML	305.00",
    "37	III	7376232CB142	SANJAY M	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Ms. VAISHNAVI N CSBS	1,940.00",
    "38	III	7376232CB143	SANJITH S	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Ms. VAISHNAVI N CSBS	726.00",
    "39	III	7376232CB144	SARAN S	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Ms. VAISHNAVI N CSBS	781.00",
    "40	III	7376232CB146	SASIKUMAR K	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Ms. VAISHNAVI N CSBS	302.00",
    "41	III	7376232CB147	SHANMUGA RAMANA N	B. Tech.	COMPUTER SCIENCE AND BUSINESS SYSTEMS	Ms. VAISHNAVI N CSBS	618.00"
];

const defaultPassword = "123456";
const hashedPassword = bcrypt.hashSync(defaultPassword, 10);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();
  console.log("Seeding started...");

  // =============================
  // 1️⃣ Extract Unique Mentors
  // =============================
  const mentorsMap = new Map();

  for (const line of rawData) {
    const parts = line.split(/\t+/);
    if (parts.length > 6) {
      const cleanName = parts[6]
        .replace(/Mr\.|Ms\.|Dr\.?|Mrs\./g, "")
        .trim();

      const nameParts = cleanName.split(" ");
      const email =
        `${nameParts[0]?.toLowerCase()}.` +
        `${nameParts[1]?.toLowerCase() || "mentor"}@mentor.com`;

      if (!mentorsMap.has(cleanName)) {
        mentorsMap.set(cleanName, { name: cleanName, email });
      }
    }
  }

  const mentorUserMap = new Map();

  for (const [name, data] of mentorsMap) {
    let user = await User.findOne({ email: data.email });

    if (!user) {
      user = await User.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "mentor",
      });
      console.log(`Created Mentor: ${data.name}`);
    }

    mentorUserMap.set(name, user);
  }

  // =============================
  // 2️⃣ Create Students + Mapping
  // =============================
  for (const line of rawData) {
    const parts = line.split(/\t+/);
    if (parts.length < 8) continue;

    const regNo = parts[2].trim();
    const name = parts[3].trim();
    const dept = parts[5].trim();

    // Safe email: firstname + lastInitial + regNo
    const nameParts = name.split(" ");
    const email =
      `${nameParts[0].toLowerCase()}` +
      `${nameParts[1]?.[0]?.toLowerCase() || ""}` +
      `${regNo.toLowerCase()}@student.com`;

    // Clean reward points
    let pointsStr = parts[7].trim().replace(/,/g, "");
    let points = 0;

    if (pointsStr.startsWith("(") && pointsStr.endsWith(")")) {
      points = -parseFloat(pointsStr.replace(/[()]/g, ""));
    } else {
      points = parseFloat(pointsStr);
    }

    try {
      // 1️⃣ Create User
      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          name,
          email,
          password: hashedPassword,
          role: "student",
        });
        console.log(`Created Student User: ${name}`);
      }

      // 2️⃣ Create Student Profile
      let studentProfile = await Student.findOne({ userId: user._id });

      if (!studentProfile) {
        studentProfile = await Student.create({
          userId: user._id,
          department: dept,
          batch: "2023-2027",
          rewardPointsTotal: points || 0,
          cgpa: 0,
          attendance: 75,
          backlogs: 0,
        });
        console.log(`Created Student Profile: ${name}`);
      }

      // 3️⃣ Assign Mentor
      const mentorNameRaw = parts[6]
        .replace(/Mr\.|Ms\.|Dr\.?|Mrs\./g, "")
        .trim();

      const mentorUser = mentorUserMap.get(mentorNameRaw);

      if (mentorUser && studentProfile) {
        const existingMapping = await MentorStudent.findOne({
          studentId: studentProfile._id,
        });

        if (!existingMapping) {
          await MentorStudent.create({
            mentorId: mentorUser._id,
            studentId: studentProfile._id,
          });
          console.log(`Assigned ${name} to ${mentorUser.name}`);
        }
      }
    } catch (error) {
      console.error(`Error processing ${name}:`, error.message);
    }
  }

  console.log("Seeding complete!");
  process.exit();
};

seedData();