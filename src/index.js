import './style_index.css';
import './style_theme.css';

function test() {
    const root = document.querySelector('root');
    root.innerHTML = `
        <div class="${container}">
            <h1 class="${title}">Hello World</h1>
        </div>
    `;
}

test();