// // The application name to be displayed in the document title.
// export const APP_NAME = process.env.REACT_APP_NAME || 'KK Cafe';

// //  Whether the app is set up to run demo sessions.
// export const IS_DEMO_MODE = process.env.REACT_APP_IS_DEMO_MODE === 'true';

// // The path to the directory containing data for the internationalization of the app.
// export const I18N_PATH = process.env.REACT_APP_I18N_PATH || './locales';


// The application name to be displayed in the document title.
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'KK Cafe';
// Whether the app is set up to run demo sessions.
export const IS_DEMO_MODE = import.meta.env.VITE_APP_IS_DEMO_MODE === 'true';
// The path to the directory containing data for the internationalization of the app.
export const I18N_PATH = import.meta.env.VITE_APP_I18N_PATH || './locales';
