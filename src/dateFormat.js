import moment from 'moment'

export default function dateFormat(date) {
  if (!date) return ''
  return moment(date).format("MMMM Do, YYYY")
}
