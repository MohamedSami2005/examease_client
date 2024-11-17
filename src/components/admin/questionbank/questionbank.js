import React, { useState } from "react";
import axios from "axios";

function QuestionBank() {
  const [courseCode, setCourseCode] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    questionNumber: "",
    questionText: "",
    questionImage: null,
    options: [{ text: "", image: null }, { text: "", image: null }, { text: "", image: null }],
    correctAnswer: "",
  });

  // Handles changes in course code input
  const handleCourseCodeChange = (e) => {
    setCourseCode(e.target.value.trim());
  };

  // Handles text input changes for question fields
  const handleInputChange = (e, field) => {
    setCurrentQuestion({ ...currentQuestion, [field]: e.target.value });
  };

  // Handles option text input changes
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index].text = value;
    setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
  };

  // Handles image upload for questions or options
  const handleImageChange = (e, field, index = null) => {
    const file = e.target.files[0];
    const imageURL = file ? URL.createObjectURL(file) : null;

    if (field === "questionImage") {
      setCurrentQuestion({ ...currentQuestion, questionImage: imageURL });
    } else if (field === "optionImage" && index !== null) {
      const updatedOptions = [...currentQuestion.options];
      updatedOptions[index].image = imageURL;
      setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
    }
  };

  // Removes an uploaded image
  const handleRemoveImage = (field, index = null) => {
    if (field === "questionImage") {
      setCurrentQuestion({ ...currentQuestion, questionImage: null });
    } else if (field === "optionImage" && index !== null) {
      const updatedOptions = [...currentQuestion.options];
      updatedOptions[index].image = null;
      setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
    }
  };

  // Adds a new option to the current question
  const addOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, { text: "", image: null }],
    });
  };

  // Validates and saves the current question to the list
  const handleSave = () => {
    if (courseCode && currentQuestion.questionText && currentQuestion.correctAnswer) {
      setQuestions([...questions, currentQuestion]);
      setCurrentQuestion({
        questionNumber: "",
        questionText: "",
        questionImage: null,
        options: [{ text: "", image: null }, { text: "", image: null }, { text: "", image: null }],
        correctAnswer: "",
      });
      alert("Question saved. Add the next question.");
    } else {
      alert("Please fill all fields before saving.");
    }
  };

  const sendDataToBackend = async () => {
    if (questions.length > 0) {
      try {
        const formattedQuestions = questions.map((question, index) => ({
          courseCode: courseCode,
          questionNumber: index + 1,
          questionText: question.questionText, 
          questionImage: question.questionImage || null,
          options: question.options,
          correctAnswer: question.correctAnswer,
        }));
        
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/save-question`,
          { courseCode, questions: formattedQuestions }
        );

        console.log("Response from server:", response.data);
        alert("Questions saved successfully!");
      } catch (error) {
        console.error("Error saving questions:", error.response?.data || error.message);
        alert(
          `An error occurred while saving questions: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    } else {
      alert("No questions added yet.");
    }
  };

  // Handles final submission and logging
  const handleSaveAndConfirm = () => {
    if (questions.length > 0) {
      console.log("Course Code:", courseCode);
      console.log("Questions:", questions);
      sendDataToBackend(); // Call the function to send data
    } else {
      alert("No questions added yet.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Question Bank</h2>

      {/* Course Code */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Course Code:</label>
        <input
          type="text"
          value={courseCode}
          onChange={handleCourseCodeChange}
          placeholder="Enter Course Code"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
  <label className="block text-gray-700 font-semibold mb-2">Question Number:</label>
  <input
    type="number"
    value={currentQuestion.questionNumber}
    onChange={(e) => handleInputChange(e, "questionNumber")}
    placeholder="Enter Question Number"
    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>


      {/* Question Input */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Question:</label>
        <textarea
          value={currentQuestion.questionText}
          onChange={(e) => handleInputChange(e, "questionText")}
          placeholder="Enter Question"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
        ></textarea>
      </div>
      {/* Image Upload */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Upload Question Image (optional):</label>
        <input
          type="file"
          onChange={(e) => handleImageChange(e, "questionImage")}
          className="w-full"
        />
        {currentQuestion.questionImage && (
          <div className="mt-4 relative">
            <img
              src={currentQuestion.questionImage}
              alt="Question Preview"
              className="w-full h-auto rounded-md border"
            />
            <button
              onClick={() => handleRemoveImage("questionImage")}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Options:</label>
        {currentQuestion.options.map((option, index) => (
          <div key={index} className="mb-4 p-4 border border-gray-300 rounded-md">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="file"
                onChange={(e) => handleImageChange(e, "optionImage", index)}
                className="w-1/3"
              />
            </div>
            {option.image && (
              <div className="mt-2 relative">
                <img
                  src={option.image}
                  alt={`Option ${index + 1} Preview`}
                  className="w-full h-auto rounded-md border"
                />
                <button
                  onClick={() => handleRemoveImage("optionImage", index)}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        ))}
        <button
          onClick={addOption}
          className="mt-2 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 focus:outline-none"
        >
          Add Option
        </button>
      </div>

      {/* Correct Answer */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Correct Answer:</label>
        <select
          value={currentQuestion.correctAnswer}
          onChange={(e) => handleInputChange(e, "correctAnswer")}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Correct Answer</option>
          {currentQuestion.options.map((option, index) => (
            <option key={index} value={index}>
              {`Option ${index + 1}`}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Save
        </button>
        <button
          onClick={handleSaveAndConfirm}
          className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none"
        >
          Save & Confirm
        </button>
      </div>
    </div>
  );
}

export default QuestionBank;