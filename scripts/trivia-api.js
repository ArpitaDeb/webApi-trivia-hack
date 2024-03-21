const _question = document.getElementById('question');
const _options = document.querySelector('.body__options');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');

let correctAnswer = "", correctScore = askedCount = 0, totalQuestion = 10;
// Load question from API with error handling
async function loadQuestion() {
    // Check if cached questions are valid
    if (isCacheValid()) {
        // Load questions from local storage if valid
        const cachedData = JSON.parse(localStorage.getItem('triviaQuestions'));
        const questions = cachedData.questions;
        
        if (questions.length > 0) {
            // Use the first cached question and update the cache
            showQuestion(questions[0]);
            updateQuestionCache(questions.slice(1));
            return; // Exit the function
        }
    }
    
    // If no valid cache, fetch new questions
    try {
        const APIUrl = 'https://opentdb.com/api.php?amount=10'; // Fetch more to cache
        const result = await fetch(APIUrl);
        const data = await result.json();
        if (data.results && data.results.length > 0) {
            // Cache the fetched questions
            cacheQuestions(data.results);
            // Display the first question and remove it from the cache
            showQuestion(data.results[0]);
            updateQuestionCache(data.results.slice(1));
        } else {
            console.error('No results found');
        }
    } catch (error) {
        console.error('Failed to load question:', error);
    }
}

// Update the cached questions after removing the used question
function updateQuestionCache(updatedQuestions) {
    // Reuse the cacheQuestions function to update the cache with new timestamp
    cacheQuestions(updatedQuestions);
}


function cacheQuestions(questions) {
    const dataToCache = {
        timestamp: new Date().getTime(),
        questions: questions,
    };
    localStorage.setItem('triviaQuestions', JSON.stringify(dataToCache));
}

function isCacheValid() {
    const cache = JSON.parse(localStorage.getItem('triviaQuestions'));
    if (!cache) return false;

    const cacheAge = (new Date().getTime() - cache.timestamp) / 1000 / 60; // Convert to minutes
    return cacheAge < 60; // Example: cache is valid for 60 minutes
}


// Display question and options
function showQuestion(data){
    _checkBtn.disabled = false;
    correctAnswer = data.correct_answer;
    let incorrectAnswers = data.incorrect_answers;
    let optionsList = incorrectAnswers;
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswers.length + 1)), 0, correctAnswer);
    
    _question.innerHTML = `${data.question} <br> <span class="category">${data.category}</span>`;
    _options.innerHTML = optionsList.map((option, index) => `<li>${index + 1}. <span>${option}</span></li>`).join('');
    selectOption();
}

// Options selection
function selectOption(){
    _options.querySelectorAll('li').forEach(option => {
        option.addEventListener('click', () => {
            if(_options.querySelector('.selected')){
                const activeOption = _options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
}
