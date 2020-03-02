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
      modify: 'Modify',
      modifyPassword: 'Change Password',
      logout: 'LOGOUT',
      logoutText: 'Logout?',
      name: 'Name',
      campus: 'Campus',
      location: 'Dormitory',
      telephone: 'Telephone',
      modifyAccountInfoNote: 'Click botton again to save changes.',
      modifyAccountInfoSucceed: 'Save successfully!',
      modifyAccountInfoFailed: 'Save failed, please try again.',
      presentPassword: 'Present Password',
      modifiedPassword: 'New Password',
      reModifiedPassword: 'Rewrite New Password',
      passwordMaxLengthErr: 'Password no more than 32 characters',
      passwordminLengthErr: 'Password no less than 6 characters',
      presentPasswordRequiredErr: 'Present password needed',
      modifiedPasswordRequiredErr: 'New password needed',
      reModifiedPasswordRequiredErr: 'Please input your new password again',
      reModifiedPasswordErr: 'The new passwords you entered are different. Please re-enter',
      modifyPasswordSucceed: 'You have modified your password!',
      presentPasswordErr: 'Present password wrong, please enter again',
      unknownErr: 'Unknown errors happened. Modify password failed',
      cancel: 'CANCEL',
      submit: 'SUBMIT',
      confirm: 'CONFIRM'
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
    loginSucceed: 'Welcome, ',
    tokenCheckFailed: 'Account voucher expired or wrong, please login again!'
  }
}
