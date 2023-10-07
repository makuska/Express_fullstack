import ReactDOM from 'react-dom/client';
import App from './App';

// The '!' mark asserts that this value is NEVER null - no type errors anymore
const root: ReactDOM.Root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <App />
);

