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
    infoNote: {
      note: 'We highly recommend you to check if the network is in arrears and try to restart the router'
    }
  },
  user: {
    account: {
      title: 'Account information',
      modify: 'Modify',
      modifyPassword: 'Reset Pwd',
      logout: 'LOGOUT',
      logoutText: 'Logout?',
      name: 'Name',
      nickname: 'Nickname',
      gender: 'Gender',
      campus: 'Campus',
      location: 'Dormitory',
      telephone: 'Telephone',
      intro: 'Introduction',
      nameMaxLengthErr: 'Name no more than 20 characters',
      nicknameMaxLengthErr: 'Nickname no more than 30 characters',
      introMaxLengthErr: 'Personal intro no more than 50 characters',
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
      finishedOrderTime: 'Order Time',
      firstOrderDate: 'First Order Date',
      firstOrderSolver: 'First Order Solver',
      lastOrderDate: 'Last Order Date',
      lastOrderSolver: 'Last Order Solver',
      unlockedSolver: 'Unlocked Solver Number',
      bestSolver: 'Best Solver of You',
      bestSolverOrderedTime: 'and He/She Helped You',
      finishedOrderTimeTotally: 'Order Time Totally',
      finishedOrderTimeMonthly: 'Order Time Monthly',
      firstOrderUser: 'First Order User',
      lastOrderUser: 'Last Order User',
      unlockedUser: 'Unlocked User Number',
      bestUser: 'Best User of You',
      bestUserOrderedTime: 'and You Helped He/She'
    }
  },
  order: {
    waitingStatus: 'waiting',
    receiptedStatus: 'receipted',
    canceledByUserStatus: 'canceled by user',
    canceledBySolverStatus: 'canceled',
    finishedStatus: 'finished',
    unknownStatus: 'unknown',
    cancelSucceed: 'You cancelled this order successfully',
    createOrder: {
      create: 'CREATE NEW ORDER',
      cancelTip: 'completed content will not reset',
      submit: 'SUBMIT',
      cancel: 'CANCEL',
      nameLabel: 'Name',
      genderLabel: 'Gender',
      telephoneLabel: 'Telephone',
      campusLabel: 'Campus',
      dormitoryLabel: 'Dormitory',
      descriptionLabel: 'Description (optional)',
      nameMaxLengthErr: 'Name must be at most 20 characters long',
      nameRequiredErr: 'Name is required',
      telephoneMaxLengthErr: 'Telephone must be at most 11 characters long',
      telephoneRequiredErr: 'Telephone is required',
      campusRequiredErr: 'Campus location is required',
      genderRequiredErr: 'Make sure to meet right solver',
      dormitoryRequiredErr: 'Dormitory location and number is required',
      descriptionHint: 'Adding your free time or a description of the situation can help us solve the problem better',
      autoEnter: 'AUTO',
      autoEnterNote: 'base on your own information',
      orderStatusErr: 'You have an order in progress and cannot create a new one',
      orderStatusCheckErr: 'Failed to get order information',
      createFailed: 'Order creation failed, please call us to complain!',
      createSucceed: 'Order created successfully, we will deal with it as soon as possible!'
    },
    latestOrder: {
      title: 'Latest order',
      freeTime: 'Free time',
      location: 'Dormitory',
      solver: 'Solver',
      solverTelephone: 'Work Tel',
      viewDetails: 'VIEW DETAILS',
      status: 'Status',
      cancelOrder: 'CANCEL ORDER',
      cancel: 'CANCEL CANCEL ORDER',
      confirm: 'CONFIRM CANCEL ORDER',
      cancelOrderNote: 'Please contact the solver to cancel the accepted order',
      cancelOrderText: 'No one has received the order yet. Are you sure you want to cancel the current order?',
      cancelOrderSucceed: 'You have successfully cancelled the current order',
      cancelOrderFailed: 'Ops, you failed to cancel the current order',
      orderInfo: 'Order details',
      name: 'Name',
      campus: 'Campus',
      description: 'Description',
      telephone: 'Telephone',
      date: 'Date'
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
    logoutSuccess: 'You have successfully logged out',
    infoCheckFailed: 'User information check failed, please login again!',
    unknownFailed: 'Time has changed! Please login again.',
    tokenCheckFailed: 'Account voucher expired or wrong, please login again!'
  }
}
