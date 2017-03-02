import { range, findKey } from 'lodash'

const Texts = {
  greetingHeader: () => findKey(
    {
      'Good Morning!': range(5, 13),
      'Good Afternoon!': range(12, 18),
      'Good Evening!': range(17, 24).concat(range(0, 5))
    },
    hoursRange => hoursRange.includes(new Date().getHours())
  ),

  greetingDescription: () => `
    You've been directed here to act on an RFP for Durham School Service.
    3 out of 6 carriers have submitted bids.
  `,

  greetingToolTip: () => `
    We're glad you asked:
    Watchtower simplifies the proposal submission and communication process, and
    gives you extra time to focus on what you'd rather be doing: Not paperwork.
    Plus... registration takes less than 1 minute.
  `,

}

export default Texts
