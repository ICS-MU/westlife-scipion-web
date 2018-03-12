import { DEPLOYMENT } from '../constants'

const initialState = {
  //data: [],
  //isFetching: true
  data: {
    running: [
      {
        id: 1,
        name: 'Project X',
        size: 'small',
        duration_time: 56,
        state: 'running',
        created: '2018-03-08 14:45:00',
        finished: null,
        one_data_url: 'https://www.example.com'
      },
      {
        id: 3,
        name: 'Project Z',
        size: 'large',
        duration_time: 120,
        state: 'running',
        created: '2018-03-09 10:45:00',
        finished: null,
        one_data_url: 'https://www.example.com'
      }
    ],
    past: [
      {
        id: 2,
        name: 'Project Y',
        size: 'medium',
        duration_time: 80,
        state: 'deleted',
        created: '2018-03-05 15:00:00',
        finished: '2018-03-06 21:05:00',
        one_data_url: 'https://www.example.com'
      },
      {
        id: 4,
        name: 'Project evolution',
        size: 'small',
        duration_time: 40,
        state: 'finished',
        created: '2018-03-08 14:45:00',
        finished: '2018-03-10 09:45:00',
        one_data_url: 'https://www.example.com'
      },
      {
        id: 5,
        name: 'Project A',
        size: 'small',
        duration_time: 10,
        state: 'finished',
        created: '2018-03-08 14:45:00',
        finished: '2018-03-09 04:45:00',
        one_data_url: 'https://www.example.com'
      }
    ]
  },
  isFetching: false,
  isFulfilled: true
}

export default function deploymentUpdate(state = initialState, { type, payload }) {
  switch(type) {
    case DEPLOYMENT.RUNNING.LIST: {
      return {
        data: [...payload],
        isFetching: false
      }
    }
    default:
      return state
  }
}