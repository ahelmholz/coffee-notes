const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://coffee-notes-3c478.firebaseio.com",
  });
} catch (e) {
  console.log(e);
}

const db = admin.database();

exports.handler = async (event, context, callback) => {
  const usersRef = db.ref("/users");
  const { httpMethod, queryStringParameters, body } = event;
  if (httpMethod === "GET") {
    const { userId } = queryStringParameters;
    await usersRef.child(userId).once("value", (snapshot) => {
      const data = snapshot.val();
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: { "Content-type": "application/json" },
      });
    });
  } else if (httpMethod === "POST") {
    const jsonBody = JSON.parse(body);
    const userId = jsonBody.userId;
    delete jsonBody.userId;
    const newPostRef = usersRef.child(userId + "/scorings").push();
    (await newPostRef).set(jsonBody);

    // const userId = usersRef.push().key;
    // usersRef.child(userId).set({
    //   first_name: "Austin",
    //   last_name: "helmholz",
    // });
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({ msg: "Successfully added coffee note" }),
    });
  } else {
    return { statusCode: 404 };
  }
};
