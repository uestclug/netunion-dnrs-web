const devData = {
  account: {
    token: 'thisIsAToken',
    stdId: '2018090000000',
    userId: '114514',
    name: 'Developer',
    nickname: 'Dev-Developer',
    gender: '男(Male)',
    telephone: '18900000000',
    campus: '沙河校区(Shahe Campus)',
    dormitory: '这是某间寝室地址',
    intro: '这是一段介绍信息。'
  },
  order: {
    acceptedOrders: [
      {
        order_id: '10001',
        order_user_dormitory: 'Dormitory location.',
        order_user_name: 'A user',
        order_user_gender: '男',
        order_user_campus: '清水河校区',
        order_user_telephone: '17800000000',
        order_user_description: 'This is description.',
        create_date: '2020/10/10 上午11:49:08',
        order_open_time: '12 h 21 min'
      },
      {
        order_id: '10002',
        order_user_dormitory: '[未透露寝室地址]',
        order_user_name: '[匿名用户]',
        order_user_gender: '女',
        order_user_campus: '沙河校区',
        order_user_telephone: '',
        order_user_description: 'This is description.',
        create_date: '2020/10/10 上午11:50:00',
        order_open_time: '12 h 20 min'
      }
    ],
    orderListOrders: [
      {
        order_id: '10003',
        order_user_dormitory: 'Dormitory location.',
        order_user_name: 'A user',
        order_user_gender: '男',
        order_user_campus: '清水河校区',
        order_user_telephone: '17800000000',
        order_user_description: 'This is description.',
        create_date: '2020/10/10 上午11:49:08',
        order_open_time: '12 h 21 min',
        order_status: 'waiting',
        is_solver: false,
        solver_name: '',
        order_solver_record: '',
        close_date: ''
      },
      {
        order_id: '10004',
        order_user_dormitory: 'Dormitory location.',
        order_user_name: 'A user',
        order_user_gender: '男',
        order_user_campus: '清水河校区',
        order_user_telephone: '17800000000',
        order_user_description: 'This is description.',
        create_date: '2020/10/10 上午11:49:08',
        order_open_time: '12 h 21 min',
        order_status: 'receipted',
        is_solver: true,
        solver_name: 'Developer',
        order_solver_record: '',
        close_date: ''
      },
      {
        order_id: '10005',
        order_user_dormitory: 'Dormitory location.',
        order_user_name: 'A user',
        order_user_gender: '男',
        order_user_campus: '清水河校区',
        order_user_telephone: '17800000000',
        order_user_description: 'This is description.',
        create_date: '2020/10/10 上午11:49:08',
        order_open_time: '12 h 22 min',
        order_status: 'finished',
        is_solver: true,
        solver_name: 'Developer',
        order_solver_record: '',
        close_date: '2020/10/10 上午11:50:00'
      },
      {
        order_id: '10005-2',
        order_user_dormitory: 'Dormitory location.',
        order_user_name: 'A user',
        order_user_gender: '男',
        order_user_campus: '清水河校区',
        order_user_telephone: '17800000000',
        order_user_description: 'This is description.',
        create_date: '2020/10/10 上午11:49:08',
        order_open_time: '12 h 22 min',
        order_status: 'finished',
        is_solver: false,
        solver_name: 'Other Developer',
        order_solver_record: '',
        close_date: '2020/10/10 上午11:50:00'
      },
      {
        order_id: '10006',
        order_user_dormitory: 'Dormitory location.',
        order_user_name: 'A user',
        order_user_gender: '男',
        order_user_campus: '清水河校区',
        order_user_telephone: '',
        order_user_description: 'This is description.',
        create_date: '2020/10/10 上午11:49:08',
        order_open_time: '-',
        order_status: 'recorded',
        is_solver: true,
        solver_name: 'Developer',
        order_solver_record: 'This is record',
        close_date: '2020/10/10 上午11:49:08'
      },
      {
        order_id: '10007',
        order_user_dormitory: 'Dormitory location.',
        order_user_name: 'A user',
        order_user_gender: '男',
        order_user_campus: '清水河校区',
        order_user_telephone: '17800000000',
        order_user_description: 'This is description.',
        create_date: '2020/10/10 上午11:49:08',
        order_open_time: '12 h 21 min',
        order_status: 'receipted',
        is_solver: false,
        solver_name: 'Other Developer',
        order_solver_record: '',
        close_date: ''
      },
      {
        order_id: '10008',
        order_user_dormitory: 'Dormitory location.',
        order_user_name: 'A user',
        order_user_gender: '男',
        order_user_campus: '清水河校区',
        order_user_telephone: '',
        order_user_description: 'This is description.',
        create_date: '2020/10/10 上午11:49:08',
        order_open_time: '12 h 21 min',
        order_status: 'canceled by user',
        is_solver: false,
        solver_name: '',
        order_solver_record: '',
        close_date: ''
      },
      {
        order_id: '10009',
        order_user_dormitory: 'Dormitory location.',
        order_user_name: 'A user',
        order_user_gender: '男',
        order_user_campus: '清水河校区',
        order_user_telephone: '',
        order_user_description: 'This is description.',
        create_date: '2020/10/10 上午11:49:08',
        order_open_time: '12 h 21 min',
        order_status: 'canceled by solver',
        is_solver: false,
        solver_name: '',
        order_solver_record: '',
        close_date: ''
      }
    ],
    OrderActionNotes: [
      {
        action_date: '2020/10/10 上午11:49:09',
        notes_text: 'This is notes text.',
        user_id: '114514',
        user_name: 'Developer'
      },
      {
        action_date: '2020/10/10 上午11:49:08',
        notes_text: 'This is other notes text.',
        user_id: '114515',
        user_name: 'Other Developer'
      }
    ],
    latestOrder: {
      order_id: '10003',
      order_user_dormitory: 'Dormitory location.',
      order_user_name: 'A user',
      order_user_gender: '男(Male)',
      order_user_campus: '清水河校区(Qingshuihe Campus)',
      order_user_telephone: '17800000000',
      order_user_description: 'This is description.',
      create_date: '2020/10/10 上午11:49:08',
      order_open_time: '12 h 21 min',
      order_status: 'receipted',
      solver_id: '114514',
      order_solver_name: 'Developer',
      order_solver_telephone: '18900000000',
      close_date: ''
    },
    attendance: [
      {
        attn_date: '2020/10/10 上午11:49:09',
        solver_id: '114514',
        attn_description: 'This is attendance description.',
        solver_name: 'Development'
      },
      {
        attn_date: '2020/10/10 上午11:49:08',
        solver_id: '114515',
        attn_description: 'This is one more attendance description.',
        solver_name: 'Other Development'
      }
    ],
    assignee: [
      {
        solver_id: '114515',
        solver_std_id: '20190000000',
        solver_name: 'Other Developer'
      },
      {
        solver_id: '114516',
        solver_std_id: '20200000000',
        solver_name: 'Other Developer-2'
      }
    ]
  },
  about: {
    valueCreateOrder: [1, 3, 5, 6, 4, 2, 3, 6, 7, 2, 1, 3, 5, 6, 4, 2, 3, 6, 7, 2, 1, 3, 5, 6, 4, 2, 3, 6, 7, 2],
    createOrderCount: 117,
    valueFinishOrder: [0, 2, 6, 6, 3, 2, 3, 6, 7, 2, 0, 2, 7, 6, 3, 2, 3, 6, 7, 2, 0, 2, 7, 6, 3, 2, 3, 6, 7, 2],
    finishedOrderCount: 111,
    mvsolvers: [
      {
        user_id: '114515',
        nickname: 'Nick',
        name: 'Nick Name',
        finish_order_count: 100,
        intro: 'Hi, I\'m Nick. Nick to meet you!'
      },
      {
        user_id: '114516',
        nickname: 'Jason',
        name: 'Jason Name',
        finish_order_count: 10,
        intro: 'Hi, I\'m Jason. Nick to meet you, too!'
      },
      {
        user_id: '114517',
        nickname: 'Aoliao',
        name: 'Aoliao Name',
        finish_order_count: 1,
        intro: 'Hi, I\'m Aoliao. Nick to meet you, too, too!'
      }
    ]
  }
}

module.exports = devData
