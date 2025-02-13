// import { RouterProvider } from 'react-router-dom';
// import { router } from './routes';

import ApiDemo from './components/demo/ApiDemo';
import CandidateDemo from './components/demo/CandidateDemo';
import UniversityDemo from './components/demo/UniversityDemo';
import CompanyJobsDemo from './components/demo/CompanyJobsDemo';

export default function App() {
  // return <RouterProvider router={router} />;
  return (
    <div className='space-y-8 py-8'>
      <CompanyJobsDemo />
      <ApiDemo />
      <CandidateDemo />
      <UniversityDemo />
    </div>
  );
}
