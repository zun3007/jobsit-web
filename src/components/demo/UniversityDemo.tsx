import { useState } from 'react';
import { useUniversities } from '@/hooks/useUniversities';
import Spinner from '@/components/ui/Spinner';
import Toast from '@/components/ui/Toast';
import { UniversityDemand } from '@/services/universityService';

export default function UniversityDemo() {
  const {
    universities,
    totalUniversities,
    isLoading,
    getUniversityDetails,
    updateUniversity,
    getDemands,
    createDemand,
    updateDemand,
    deleteDemand,
    isUpdating,
    isCreatingDemand,
    isUpdatingDemand,
    isDeletingDemand,
  } = useUniversities();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [selectedUniversityId, setSelectedUniversityId] = useState<
    number | null
  >(null);
  const [demands, setDemands] = useState<UniversityDemand[]>([]);

  const handleViewDetails = async (id: number) => {
    try {
      await getUniversityDetails(id);
      setSelectedUniversityId(id);
      showSuccessToast('University details loaded successfully!');
    } catch {
      showErrorToast('Failed to load university details.');
    }
  };

  const handleUpdateUniversity = async (id: number) => {
    try {
      const formData = new FormData();
      formData.append('name', 'Updated University Name');
      formData.append('description', 'Updated university description...');
      await updateUniversity(formData);
      showSuccessToast('University updated successfully!');
    } catch {
      showErrorToast('Failed to update university.');
    }
  };

  const handleViewDemands = async (id: number) => {
    try {
      const result = await getDemands(id);
      setDemands(result);
      showSuccessToast('Demands loaded successfully!');
    } catch {
      showErrorToast('Failed to load demands.');
    }
  };

  const handleCreateDemand = async (universityId: number) => {
    try {
      await createDemand({
        universityId,
        data: {
          title: 'New Internship Program',
          description: 'Looking for talented students...',
          requirements: 'Strong academic background...',
          major: 'Computer Science',
          deadline: '2024-12-31',
        },
      });
      showSuccessToast('Demand created successfully!');
      handleViewDemands(universityId);
    } catch {
      showErrorToast('Failed to create demand.');
    }
  };

  const handleUpdateDemand = async (universityId: number, demandId: number) => {
    try {
      await updateDemand({
        universityId,
        demandId,
        data: {
          title: 'Updated Internship Program',
          status: 'CLOSED',
        },
      });
      showSuccessToast('Demand updated successfully!');
      handleViewDemands(universityId);
    } catch {
      showErrorToast('Failed to update demand.');
    }
  };

  const handleDeleteDemand = async (universityId: number, demandId: number) => {
    try {
      await deleteDemand({ universityId, demandId });
      showSuccessToast('Demand deleted successfully!');
      handleViewDemands(universityId);
    } catch {
      showErrorToast('Failed to delete demand.');
    }
  };

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setToastType('success');
    setShowToast(true);
  };

  const showErrorToast = (message: string) => {
    setToastMessage(message);
    setToastType('error');
    setShowToast(true);
  };

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-4xl mx-auto space-y-8'>
        <h1 className='text-3xl font-bold'>University Features Demo</h1>

        {/* Universities List */}
        <div className='bg-white rounded-lg shadow p-6'>
          <h2 className='text-xl font-semibold mb-4'>Universities</h2>
          {isLoading ? (
            <div className='flex justify-center p-8'>
              <Spinner size='lg' />
            </div>
          ) : (
            <div className='space-y-4'>
              <p className='text-sm text-gray-600'>
                Total Universities: {totalUniversities}
              </p>
              {universities.map((university) => (
                <div
                  key={university.id}
                  className='border rounded-lg p-4 space-y-4'
                >
                  <div>
                    <h3 className='font-medium'>{university.name}</h3>
                    <p className='text-sm text-gray-600'>
                      {university.location}
                    </p>
                  </div>
                  <div className='flex space-x-2'>
                    <button
                      onClick={() => handleViewDetails(university.id)}
                      className='btn btn-primary'
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleUpdateUniversity(university.id)}
                      disabled={isUpdating}
                      className='btn btn-outline'
                    >
                      {isUpdating ? (
                        <Spinner size='sm' className='mr-2' />
                      ) : null}
                      Update
                    </button>
                    <button
                      onClick={() => handleViewDemands(university.id)}
                      className='btn btn-secondary'
                    >
                      View Demands
                    </button>
                  </div>

                  {/* Demands Section */}
                  {selectedUniversityId === university.id &&
                    demands.length > 0 && (
                      <div className='mt-4 space-y-4'>
                        <h4 className='font-medium'>University Demands</h4>
                        <button
                          onClick={() => handleCreateDemand(university.id)}
                          disabled={isCreatingDemand}
                          className='btn btn-primary'
                        >
                          {isCreatingDemand ? (
                            <Spinner
                              size='sm'
                              variant='white'
                              className='mr-2'
                            />
                          ) : null}
                          Create New Demand
                        </button>
                        <div className='space-y-4'>
                          {demands.map((demand) => (
                            <div key={demand.id} className='border rounded p-4'>
                              <h5 className='font-medium'>{demand.title}</h5>
                              <p className='text-sm text-gray-600'>
                                Status: {demand.status}
                              </p>
                              <div className='mt-2 flex space-x-2'>
                                <button
                                  onClick={() =>
                                    handleUpdateDemand(university.id, demand.id)
                                  }
                                  disabled={isUpdatingDemand}
                                  className='btn btn-outline'
                                >
                                  {isUpdatingDemand ? (
                                    <Spinner size='sm' className='mr-2' />
                                  ) : null}
                                  Update
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteDemand(university.id, demand.id)
                                  }
                                  disabled={isDeletingDemand}
                                  className='btn btn-danger'
                                >
                                  {isDeletingDemand ? (
                                    <Spinner
                                      size='sm'
                                      variant='white'
                                      className='mr-2'
                                    />
                                  ) : null}
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toast Notification */}
        {showToast && (
          <Toast
            type={toastType}
            message={toastMessage}
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    </div>
  );
}
