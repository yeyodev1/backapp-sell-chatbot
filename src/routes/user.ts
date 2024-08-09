import express from 'express';

import {
	// createUser,
	setUserName,
	setUserEmail,
	setUserBusinessIndustry
} from "../controllers/user.controller";

const router = express.Router();

// router.post('/user', createUser);

// form routes
router.post('/user-set-name', setUserName);
router.post('/user-set-email', setUserEmail);
router.post('/user-set-business-industry', setUserBusinessIndustry)
// router.post('/user-set-ask-location', setUserLocation);


// //show date to user
// router.get('/user-show-dates', showLocationDates);
// router.post('/user-get-date', setLocationDate);

export default router;