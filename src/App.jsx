import './App.css';
import StepForm from './components/StepForm';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative">
      {/* Header */}
      <header className="bg-blue-100 shadow p-4 fixed top-0 left-0 w-screen">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">Kinzai</h1>
          {/* <span className="text-gray-500">Welcome to identity verification</span> */}
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow py-[5rem]">
        <StepForm />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t p-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Kinzai. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
