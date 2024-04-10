const ComfirmModal = ({ message, onConfirm, isOpen, setIsOpen }) => {
  return (
    <div
      className={`w-full h-full fixed top-0 flex justify-center items-center bg-slate-950 bg-opacity-70 text-white ${
        isOpen ? " " : " hidden"
      }`}
    >
      <div className=" p-8 rounded-lg w-[300px] bg-black">
        <h3 className="font-bold text-lg text-center">Confirm</h3>
        <p className="py-4">{message}</p>
        <div className=" flex justify-around items-center">
          <button
            className=" btn btn-error text-white"
            onClick={() => onConfirm()}
          >
            Comfirm
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="btn btn-primary text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComfirmModal;
