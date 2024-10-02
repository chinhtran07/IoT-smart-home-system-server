// userProperties.js

const userProperties = {
  id: {
    isVisible: { list: false, filter: true, show: true, edit: false },
  },
  email: {
    isVisible: { list: true, filter: true, show: true, edit: true },
  },
  firstName: {
    isVisible: { list: true, filter: true, show: true, edit: true },
  },
  lastName: {
    isVisible: { list: true, filter: true, show: true, edit: true },
  },
  username: {
    isVisible: { list: true, filter: true, show: true, edit: true },
  },
  password: {
    isVisible: { list: false, filter: false, show: false, edit: true },
  },
};

export default {
  userProperties
};
