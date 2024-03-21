// Event listeners
function eventListeners(){
    _checkBtn.addEventListener('click', checkAnswer);
    _playAgainBtn.addEventListener('click', restartTrivia);
}

document.addEventListener('DOMContentLoaded', function(){
    loadQuestion(); // This function will be defined in trivia-api.js
    eventListeners();
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
});

// Positioning popup
function positionModal() {
    const triviaHeight = trivia.offsetHeight;
    const modalHeight = modal.offsetHeight;
    const topPosition = (triviaHeight - modalHeight) / 2;
    modal.style.top = `${topPosition}px`;
}

// Answer checking
function checkAnswer(){
    _checkBtn.disabled = true;
    const feedbackText = document.getElementById('feedbackText'); // Get the feedback text container
    const feedbackModal = document.getElementById('feedbackModal'); // Get the modal
    const closeBtn = document.querySelector('.modal-content__close'); // Get the close button

    if(_options.querySelector('.selected')){
        let selectedAnswer = _options.querySelector('.selected span').textContent;
        if(selectedAnswer == HTMLDecode(correctAnswer)){
            correctScore++;
            feedbackText.innerHTML = `<p><i class = "fas fa-check"></i>Correct Answer!</p>`;
        } else {
            feedbackText.innerHTML = `<p><i class = "fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
        }
        feedbackModal.style.display = "block"; // Show the modal
        checkCount();
    } else {
        feedbackText.innerHTML = `<p><i class = "fas fa-question"></i>Please select an option!</p>`;
        feedbackModal.style.display = "block"; // Show the modal for feedback
        _checkBtn.disabled = false;
    }

    // When the user clicks on <span> (x), close the modal
    closeBtn.onclick = function() {
        feedbackModal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == feedbackModal) {
            feedbackModal.style.display = "none";
        }
    }
}


function checkCount(){
    askedCount++;
    setCount();
    if(askedCount == totalQuestion){
        _result.innerHTML += `<p>Your score is ${correctScore}.</p>`;
        _playAgainBtn.style.display = "block";
        _checkBtn.style.display = "none";
    } else {
        setTimeout(function(){
            loadQuestion();
        }, 300);
    }
}

function setCount(){
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
}

function restartTrivia(){
    correctScore = askedCount = 0;
    _playAgainBtn.style.display = "none";
    _checkBtn.style.display = "block";
    _checkBtn.disabled = false;
    setCount();
    loadQuestion();
}

// Decode HTML entities in the correct answer
function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}
