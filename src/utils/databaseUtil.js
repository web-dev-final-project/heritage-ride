import { DataBaseException } from "./exceptions.js";

const handleUpdateError = (res) => {
  if (res.matchedCount === 0) {
    throw new DataBaseException(
      "No documents matched the query. Update failed."
    );
  }
  if (res.modifiedCount === 0)
    throw new DataBaseException(
      "Document matched, but no update was made (perhaps the new value is the same as the current value)."
    );
};
const handleAddError = (res) => {
  if (!res || !res.acknowledged || !res.insertedId)
    new DataBaseException("failed to insert data.");
};

export { handleUpdateError, handleAddError };
