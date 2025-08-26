document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');

    // --- Data ---
    const introduction = `
        <section>
            <h2>¿Qué es una Vela Japonesa?</h2>
            <p>Las velas japonesas son una forma de gráfico financiero que se utiliza para describir los movimientos de precios de un activo. Cada vela representa un período de tiempo (por ejemplo, un día, una hora) y muestra cuatro datos clave:</p>
            <ul>
                <li><strong>Apertura (Open):</strong> El precio al inicio del período.</li>
                <li><strong>Cierre (Close):</strong> El precio al final del período.</li>
                <li><strong>Máximo (High):</strong> El precio más alto alcanzado durante el período.</li>
                <li><strong>Mínimo (Low):</strong> El precio más bajo alcanzado durante el período.</li>
            </ul>
            <p>El "cuerpo" de la vela es la parte ancha entre el precio de apertura y el de cierre. Las "mechas" o "sombras" son las líneas delgadas que se extienden desde el cuerpo hasta los precios máximo y mínimo.</p>
            <p><strong>Vela Alcista (Bullish):</strong> Generalmente de color verde o blanco, se forma cuando el precio de cierre es más alto que el de apertura. Indica presión de compra.</p>
            <p><strong>Vela Bajista (Bearish):</strong> Generalmente de color rojo o negro, se forma cuando el precio de cierre es más bajo que el de apertura. Indica presión de venta.</p>
        </section>
    `;

    const patterns = [
        {
            title: 'Doji',
            image: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Candlestick_pattern_Doji_Star.svg',
            description: 'Un Doji se forma cuando la apertura y el cierre son prácticamente iguales. Indica indecisión en el mercado. Por sí solo es neutral, pero puede señalar una posible reversión dependiendo del contexto.',
        },
        {
            title: 'Marubozu',
            image: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Candle_marubozu_black.svg',
            description: 'Un Marubozu es una vela sin mechas (o sombras). Un Marubozu alcista (verde) abre en su mínimo y cierra en su máximo, indicando una fuerte presión de compra. Un Marubozu bajista (rojo) abre en su máximo y cierra en su mínimo, mostrando una fuerte presión de venta.',
        },
        {
            title: 'Martillo (Hammer)',
            image: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Candle_hammer.svg',
            description: 'Aparece en una tendencia bajista. Tiene un cuerpo pequeño en la parte superior y una mecha inferior larga. Sugiere una posible reversión alcista, ya que los compradores empujaron los precios hacia arriba.',
        },
        {
            title: 'Envolvente Alcista (Bullish Engulfing)',
            image: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Candlestick_pattern_bullish_engulfing.svg',
            description: 'Es un patrón de dos velas. Una pequeña vela bajista es seguida por una gran vela alcista que "envuelve" completamente a la anterior. Es una fuerte señal de reversión alcista.',
        },
        {
            title: 'Envolvente Bajista (Bearish Engulfing)',
            image: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Candlestick_pattern_bearish_engulfing.svg',
            description: 'Lo contrario al envolvente alcista. Ocurre en una tendencia alcista, donde una pequeña vela alcista es seguida por una gran vela bajista que la envuelve. Es una señal de reversión bajista.',
        },
        {
            title: 'Estrella del Amanecer (Morning Star)',
            image: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Candlestick_pattern_bullish_Morning_Doji_Star.svg',
            description: 'Patrón de tres velas que indica una reversión alcista. Comienza con una vela bajista, seguida de una pequeña vela de indecisión (como un Doji) y finaliza con una vela alcista que cierra por encima del punto medio de la primera vela.',
        },
        {
            title: 'Estrella del Anochecer (Evening Star)',
            image: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Candlestick_pattern_Evening_Doji_Star.svg',
            description: 'Es un patrón de tres velas que señala una reversión bajista. Comienza con una gran vela alcista, seguida de una pequeña vela y termina con una vela bajista que cierra por debajo del punto medio de la primera vela.',
        }
    ];

    const quizQuestions = [
        {
            question: '¿Qué patrón de vela indica indecisión en el mercado, con precios de apertura y cierre casi idénticos?',
            image: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Candlestick_pattern_Doji_Star.svg',
            answers: [
                { text: 'Martillo', correct: false },
                { text: 'Doji', correct: true },
                { text: 'Marubozu', correct: false },
            ],
        },
        {
            question: 'En una tendencia bajista, aparece una vela con un cuerpo pequeño y una mecha inferior larga. ¿Qué patrón es y qué sugiere?',
            image: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Candle_hammer.svg',
            answers: [
                { text: 'Estrella del Anochecer, reversión bajista', correct: false },
                { text: 'Martillo, reversión alcista', correct: true },
                { text: 'Envolvente Bajista, reversión bajista', correct: false },
            ],
        },
        {
            question: 'Una vela sin mechas que cierra por encima de su apertura, mostrando un fuerte dominio comprador. ¿Cómo se llama?',
            image: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Candle_marubozu_black.svg',
            answers: [
                { text: 'Marubozu Alcista', correct: true },
                { text: 'Doji', correct: false },
                { text: 'Marubozu Bajista', correct: false },
            ],
        },
        {
            question: 'Después de una tendencia alcista, una pequeña vela alcista es completamente "envuelta" por una gran vela bajista. ¿Qué señal nos da?',
            image: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Candlestick_pattern_bearish_engulfing.svg',
            answers: [
                { text: 'Continuación de la tendencia alcista', correct: false },
                { text: 'Reversión bajista (Envolvente Bajista)', correct: true },
                { text: 'Indecisión del mercado', correct: false },
            ],
        }
    ];

    // --- Render Functions ---
    function renderContent() {
        let patternsHtml = patterns.map(p => `
            <article class="pattern-card">
                <h3>${p.title}</h3>
                <img src="${p.image}" alt="${p.title}" class="pattern-image">
                <p>${p.description}</p>
            </article>
        `).join('');

        app.innerHTML = `
            ${introduction}
            <section>
                <h2>Patrones de Velas Comunes</h2>
                <div class="patterns-container">
                    ${patternsHtml}
                </div>
            </section>
            <section id="quiz">
                <h2>Pon a Prueba tu Conocimiento</h2>
                <div id="quiz-container"></div>
            </section>
        `;

        renderQuiz();
    }

    function renderQuiz() {
        const quizContainer = document.getElementById('quiz-container');
        quizContainer.innerHTML = '';
        quizQuestions.forEach((q, index) => {
            const answersHtml = q.answers.map(a =>
                `<button data-correct="${a.correct}">${a.text}</button>`
            ).join('');

            quizContainer.innerHTML += `
                <div class="quiz-question" id="question-${index}">
                    <p>${index + 1}. ${q.question}</p>
                    <img src="${q.image}" alt="Quiz Image ${index + 1}" class="pattern-image">
                    <div class="answers">${answersHtml}</div>
                    <div class="feedback"></div>
                </div>
            `;
        });

        addQuizListeners();
    }

    function addQuizListeners() {
        const quiz = document.getElementById('quiz');
        quiz.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const button = e.target;
                const questionDiv = button.closest('.quiz-question');
                const feedbackEl = questionDiv.querySelector('.feedback');
                const isCorrect = button.dataset.correct === 'true';

                // Reset sibling buttons style
                const answerButtons = questionDiv.querySelectorAll('.answers button');
                answerButtons.forEach(btn => btn.classList.remove('correct', 'incorrect'));

                if (isCorrect) {
                    button.classList.add('correct');
                    feedbackEl.textContent = '¡Correcto! Buen trabajo.';
                    feedbackEl.className = 'feedback correct';
                } else {
                    button.classList.add('incorrect');
                    feedbackEl.textContent = 'Incorrecto. La respuesta correcta está marcada en verde.';
                    feedbackEl.className = 'feedback incorrect';
                    // Highlight the correct answer
                    const correctButton = questionDiv.querySelector('button[data-correct="true"]');
                    correctButton.classList.add('correct');
                }
            }
        });
    }

    // --- Initial Load ---
    renderContent();
});
