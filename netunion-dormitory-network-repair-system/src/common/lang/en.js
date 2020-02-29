module.exports = {
  app: {
    name: 'UESTC | Dormitory Network Repair Platform'
  },
  viewTitle: {
    home: 'HOME',
    user: 'USER',
    order: 'ORDER',
    about: 'ABOUT US',
    login: 'LOGIN'
  },
  theme: {
    darkMode: 'DARK MODE'
  },
  home: {
    welcome: {
      words: 'Don\'t worry.',
      slogan: 'We are the solvers of dormitory network problems!'
    },
    latestOrder: {
      title: 'Latest order',
      freeTime: 'Free time',
      location: 'Dormitory',
      solver: 'Solver',
      viewDetails: 'VIEW DETAILS',
      status: 'Status'
    },
    infoNote: {
      note: 'We highly recommend you to check if the network is in arrears and try to restart the router'
    }
  },
  user: {
    account: {
      title: 'Account information',
      setting: 'Modify',
      name: 'Name',
      campus: 'Campus',
      location: 'Dormitory',
      telephone: 'Telephone'
    },
    statistics: {
      title: 'Statistics',
      orderTime: 'Order Time',
      firstOrderDate: 'First Order Date',
      firstOrderSolver: 'First Order Solver',
      lastOrderDate: 'Last Order Date',
      lastOrderSolver: 'Last Order Solver',
      unlockedSolver: 'Unlocked Solver Number',
      bestSolver: 'Best Solver of You',
      bestSolverOrderedTime: 'and He/She Helped You'
    }
  },
  order: {
    createOrder: {
      create: 'CREATE NEW ORDER',
      cancelTip: 'completed content will not reset',
      submit: 'SUBMIT',
      cancel: 'CANCEL',
      nameLabel: 'Name',
      telephoneLabel: 'Telephone',
      campusLabel: 'Campus',
      dormitoryLabel: 'Dormitory',
      descriptionLabel: 'Description (optional)',
      nameMaxLengthErr: 'Name must be at most 20 characters long',
      nameRequiredErr: 'Name is required',
      telephoneMaxLengthErr: 'Telephone must be at most 11 characters long',
      telephoneRequiredErr: 'Telephone is required',
      campusRequiredErr: 'Campus location is required',
      dormitoryRequiredErr: 'Dormitory location and number is required',
      descriptionHint: 'Adding a description of the situation can help us solve the problem better'
    }
  },
  login: {
    submit: 'Login',
    usernameLabel: 'Student ID',
    pwdLabel: 'Password',
    usernameRequiredErr: 'Student ID is required as username',
    pwdRequiredErr: 'Wrong password, please check it',
    loginFailed: 'Wrong student number or password, please check it!',
    loginSucceed: 'Welcome, '
  }
}
