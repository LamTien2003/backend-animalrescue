const express = require('express');
const router = express.Router();

const animalController = require('../controller/animalController');
const filesMiddleware = require('../middleware/filesMiddleware');

router.get('/pending', animalController.getPendingAnimal);
router.get('/adopted', animalController.getAdoptedAnimal);
router.get('/:id', animalController.getAnimal);
router.post('/:id', animalController.adoptAnimal);
router.post(
    '/',
    filesMiddleware.uploadSinglePhoto('image'),
    filesMiddleware.resizeSmallPhoto('animal'),
    animalController.createAnimal,
);
router.get('/', animalController.getAllAnimal);

module.exports = router;
