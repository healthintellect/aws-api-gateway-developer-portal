module.exports = {
  url:
    process.env.NODE_ENV === 'production'
      ? 'https://hl7.cc'
      : 'http://localhost:3000',
  apiUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://api.hl7.cc'
      : 'http://localhost:4001/dev',
  mirageUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://mirage.hl7.cc'
      : 'https://idwlknarjg.execute-api.us-east-1.amazonaws.com/dev',
  rosettaUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://rosetta.hl7.cc'
      : 'https://pw8faqkgq6.execute-api.us-east-1.amazonaws.com/dev',
  facebook: {
    appId: '336254410306741',
  },
  google: {
    clientId:
      '955637222652-1kf7nfnja8ej3mh6811jcejpka8pneha.apps.googleusercontent.com',
  },
  stripePublishableKey:
    process.env.NODE_ENV === 'production'
      ? 'pk_live_FwnKDbu0MvqwuVdvyzKI60Md00XISsEVJY'
      : 'pk_test_C3LAmiWkUphQ6DBTgJ9YT49800h65Wx9De',
  anonApiKey: 'VM9n6S7o1k79kQZ566vxR6Z7BM3TbQXL5BJXfqsf',
}
