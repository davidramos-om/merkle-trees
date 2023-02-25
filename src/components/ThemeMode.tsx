import { useState } from "react";

export function getThemefromHtml() {

    const htmlClass = document.documentElement.classList;
    if (htmlClass.contains('dark'))
        return 'dark'


    if (htmlClass.contains('light'))
        return 'light'

    return '';
}

localStorage.theme = getThemefromHtml();

export const getThemeMode = () => {


    const theme = getThemefromHtml();

    if (theme)
        return theme;

    const localTheme = localStorage.theme;
    if (localTheme && (localTheme === 'dark' || localTheme === 'light')) {
        console.log('localTheme', localTheme)
        return localTheme
    }

    return 'dark'
}


export function ThemeMode() {


    const [ mode, setMode ] = useState<'dark' | 'light'>('dark')

    const handleThemeMode = () => {

        const theme = getThemeMode();

        if (theme === 'dark') {
            document.documentElement.classList.remove('dark')
            document.documentElement.classList.add('light')
            document.documentElement.style.setProperty('background-color', 'white')
            localStorage.theme = 'light'
            setMode('light')
        }
        else {
            document.documentElement.classList.remove('light')
            document.documentElement.classList.add('dark')
            document.documentElement.style.setProperty('background-color', '#f7fafc')
            localStorage.theme = 'dark'
            setMode('dark')
        }
    }

    return (
        <button
            onClick={handleThemeMode}
            className="absolute top-10 right-10 bg-slate-900 dark:-slate-600  rounded-full p-2 shadow-xl"
        >
            {mode === 'dark' ?
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><rect x="0" y="0" width="24" height="24" fill="none" stroke="none" /><path fill="yellow" d="M12 17q-2.075 0-3.537-1.463Q7 14.075 7 12t1.463-3.538Q9.925 7 12 7t3.538 1.462Q17 9.925 17 12q0 2.075-1.462 3.537Q14.075 17 12 17ZM1 13v-2h4v2Zm18 0v-2h4v2Zm-8-8V1h2v4Zm0 18v-4h2v4ZM6.35 7.75L3.875 5.275l1.4-1.4L7.75 6.35Zm12.375 12.375L16.25 17.65l1.4-1.4l2.475 2.475ZM17.65 7.75l-1.4-1.4l2.475-2.475l1.4 1.4ZM5.275 20.125l-1.4-1.4L6.35 16.25l1.4 1.4Z" /></svg> :
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><rect x="0" y="0" width="16" height="16" fill="none" stroke="none" /><g fill="white"><path d="M6 .278a.768.768 0 0 1 .08.858a7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277c.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316a.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71C0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" /><path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z" /></g></svg>
            }
        </button>
    );
}