// router.post('/addcampaign', async function(req, res, next) {
  
//     // We want to update our onGoingTicket for our user
//     var user = await userModel.findOne({token:req.body.token})
//     var campagne = new campagneModel({
//       campaignName: req.body.nameCampaignFromFront,
//       dateStart: req.body.dateStartFromFront,
//       dateEnd: req.body.dateEndFromFront,
//       status:'created',
//       description: req.body.descriptionFromFront,
//       audienceCriteria: req.body.audienceFromFront,
//       uploadedDoc: req.body.uploadDocFromFront,
//       brand_id: user._id // id de la marque récupérer a la ligne 175 avec le token 
//     })
//       var campagneSave = await campagne.save()
//      user.campagnes.push(campagneSave._id) // ajouter la nouvelle id de la creation de campagne
  
//     var userSaved = await user.save()
  
//     console.log(userSaved)
  
//     res.json({userSaved})
    
//   });

useEffect(() => {
    async function fetchData() {
    const response = await fetch('/addcampaign')
    const jsonResponse = await response.json()
    setCampaignList(jsonResponse.campaignListItem)
}
fetchData()
  }, [])
//   var campagne = await campagneModel.findOne({id:req.body.id})
//   .updateOne({}, { influencer_id: req.body.id, status:"waiting" });

//   var campagneSaved = await campagne.save()

//   res.json({campagneSaved})
  
// });
  
// UPLOAD DOC
// const multer = require('multer'),
// const uuidv4 = require('uuid/v4'),
// const DIR = './public/';

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//       cb(null, DIR);
//   },
//   filename: (req, file, cb) => {
//       const fileName = file.originalname.toLowerCase().split(' ').join('-');
//       cb(null, uuidv4() + '-' + fileName)
//   }
// });
// var upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//       if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
//           cb(null, true);
//       } else {
//           cb(null, false);
//           return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
//       }
//   }
// });

// LOCAL STORAGE NE PAS EFFACER SVP 

// const tokenLocal = localStorage.getItem('tokenLocal');
// const role = localStorage.getItem('role')
// const RenderRoute = () => {

//   if(tokenLocal && role === "influenceur") {
//     return(
//       <Switch>
//         <Route path="/login-page" exact component={LoginPage} />
//         <Route path="/select-campaign" exact component={SelectCampagne} />
//         <Route path="/campaign-apply/:id"  component={CampaignApply} />
//         <Route path="/profile-page" exact component={ProfilePage} />
//         <Route path="/sign-up/brand" exact component={SignUpBrand} />
//         <Route path="/mynetwork" exact component={MyNetwork}/>
//         <Route path="/messaging" exact component={Messaging}/>
//         <Route path="/login-messagerie" exact component={Login}/>
//          <Route path="/" exact component={LandingPage} />
//         </Switch> 
//         )}
//         else if (tokenLocal && role === "brand") {
//           return( 
//             <Switch>
//             <Route path="/choiceinfluencer" exact component={ChoiceInfluencer}/>
//             <Route path="/login-page" exact component={LoginPage} />
//             <Route path="/profile-page" exact component={ProfilePage} />
//             <Route path="/sign-up/brand" exact component={SignUpBrand} />
//             <Route path="/sign-up/influencer" exact component={SignUpInfluencer} />
//             <Route path="/mynetwork" exact component={MyNetwork}/>
//             <Route path="/messaging" exact component={Messaging}/>
//             <Route path="/choiceinfluencer" exact component={ChoiceInfluencer}/>
//             <Route path="/login-messagerie" exact component={Login}/>
//             <Route path="/" exact component={LandingPage} />
//             </Switch> 
//              )} else  {

//               return(
//                 <Switch>
// //                <Route path="/login-page" exact component={LoginPage} />

{/* <Route path="/select-campaign" exact component={SelectCampagne} /> */ }

{/* <Route path="/" exact component={LandingPage} /> */ }
{/* <Route path="/login-page" exact component={LoginPage} /> */ }
//     </Switch> 
//              )} 
// }

 {/* {RenderRoute()}  */}