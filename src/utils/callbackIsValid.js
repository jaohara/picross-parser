export default function callbackIsValid (callback) {
  return callback && typeof callback === "function";
}