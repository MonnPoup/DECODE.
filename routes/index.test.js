var app = require("../app")
var request = require("supertest")

test("Sign Up - Body correct", async (done) => {
 await request(app).post('/signUp')
   .send({ token: "xz8MvRRe0xWdH22REDuDZCpUfdNBDifu", usernameFromFront: "Sybil", emailFromFront: "sybil@sybil", passwordFromFront:'1234', paletteFromStore:'60a4e7c5cfb766ab71c0d148' })
   .expect(200)
   .expect({ result: true, error:[], saveUser:{firstName: 'Sybil', email: 'sybil@sybil', password: '$2b$10$7mnvJFrPy.DJEDdy0UJoFOY0Q6ji5As7iMo1yPx6opGFjDU.UxmvO', token: 'xz8MvRRe0xWdH22REDuDZCpUfdNBDifu', palette: '60a4e7c5cfb766ab71c0d148', wishlist:'[]'}, token:'xz8MvRRe0xWdH22REDuDZCpUfdNBDifu'});
 done();
});


 test("Sign Up - Body incomplet", async (done) => {
  await request(app).post('/signUp')
   .send({ usernameFromFront: "", emailFromFront: "sybil@sybil", passwordFromFront:'1234', paletteFromStore:'60a4e7c5cfb766ab71c0d148' })
    .expect(200)
    .expect({ result: false, error:["Champs vides"], saveUser: "undefined", token:"undefined",  });
  done();
 });

 /*
 test("Sign Up - Pas de Palette", async (done) => {
  await request(app).post('/signUp')
    .send({ usernameFromFront: "Sybil", emailFromFront: "sybil@sybil", paspasswordFromFront:'1234', paletteFromStore:'undefined' })
    .expect(200)
    .expect({ result: false, error:["Répondez au questionnaire avant de vous inscrire"] });
  done();
 });

 
 test("Sign In - Body correct", async (done) => {
  await request(app).post('/signIn')
    .send({ emailFromFront: "sybil@sybil", paspasswordFromFront:'1234' })
    .expect(200)
    .expect({ result: true, emailFromFront: "sybil@sybil", paspasswordFromFront:'1234' });
  done();
 });

 test("Sign In - Body incorrect", async (done) => {
  await request(app).post('/signIn')
    .send({ emailFromFront: "", paspasswordFromFront:'1234'})
    .expect(200)
    .expect({ result:false});
  done();
 });
 

 */