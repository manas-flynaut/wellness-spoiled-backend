function retrieveFileExt(file) {
    const fn_split = file.originalname.split(".");
    const ext = fn_split[fn_split.length - 1] || "";
    return ext;
  }
  module.exports = { retrieveFileExt };