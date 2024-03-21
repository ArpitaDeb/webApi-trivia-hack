const _question = document.getElementById('question');
const _options = document.querySelector('.body__options');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');

let correctAnswer = "", correctScore = askedCount = 0, totalQuestion = 10;
// Load question from API with error handling
async function loadQuestion(){
    try {
        const APIUrl = 'https://opentdb.com/api.php?amount=1';
        const result = await fetch(APIUrl);
        const data = await result.json();
        if(data.results && data.results.length > 0){
            _result.innerHTML = "";
            showQuestion(data.results[0]);
        } else {
            console.error('No results found');
            // Handle the case when no data is returned
        }
    } catch (error) {
        console.error('Failed to load question:', error);
        // Handle fetching error (e.g., network error, rate limiting)
    }
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
