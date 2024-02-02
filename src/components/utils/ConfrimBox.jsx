import PropTypes from "prop-types";

export default function ConfrimBox({ comfirmHandle, close, refresh }) {
  const handleConfirm = () => {
    // Trigger confirmHandle when the Confirm button is clicked
    comfirmHandle();
    refresh();
    close();
  };
  return (
    <>
      <div className="absolute z-40 top-0">
        <div
          className="relative z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <p className="mb-3 after:ml-0.5 block text-lg font-semibold text-slate-600">
                      Do you want to confirm this order?
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-75 sm:ml-3 sm:w-auto"
                    onClickCapture={handleConfirm}
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-300 sm:mt-0 sm:w-auto"
                    onClick={close}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
ConfrimBox.propTypes = {
  comfirmHandle: PropTypes.func,
  close: PropTypes.func,
  refresh: PropTypes.func,
};
