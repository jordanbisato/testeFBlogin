module.exports = {
    'facebookAuth': {
        'clientID': '657408101116489', // your App ID
        'clientSecret': '30c40229f2c8ef598981422a354068fa', // your App Secret
        'callbackURL': 'http://www.navega.gratis:8085/login-promo/auth/facebook/callback'
    },

    'twitterAuth': {
        'consumerKey': 'pKnfaRfHUNNqGTrsSoPmxS9XA',
        'consumerSecret': 'XouAUtJwv6Saa4su6QaRDLWxYiYYdxftkWU2DI9uNWsj0jjzYa',
        'callbackURL': 'http://www.navega.gratis:8085/login-promo/auth/twitter/callback',
        'userProfileURL': "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
        'includeEmail': true
    },

    'googleAuth': {
        'clientID': '103438997905-lkc2277l1h0oqt210qi6iika2arhh67e.apps.googleusercontent.com',
        'clientSecret': '6c0A60SU8tJbGytrn0C2t7DH',
        'callbackURL': 'http://www.navega.gratis:8085/login-promo/auth/google/callback'
    }
};
