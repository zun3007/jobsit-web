// import { RouterProvider } from 'react-router-dom';
// import { router } from './routes';

import SwitchDemo from './components/ui/Switch.stories';
import { ToastDemo } from './components/ui/Toast.stories';
import DropdownDemo from './components/ui/Dropdown.stories';
import SaveButtonDemo from './components/ui/SaveButton.stories';
import SpinnerDemo from './components/ui/Spinner.stories';
import LoadingSpinnerDemo from './components/ui/LoadingSpinner.stories';

export default function App() {
  // return <RouterProvider router={router} />;
  return (
    <>
      <LoadingSpinnerDemo />
      <SpinnerDemo />
      <SaveButtonDemo />
      <DropdownDemo />
      <SwitchDemo />
      <ToastDemo />
    </>
  );
}
