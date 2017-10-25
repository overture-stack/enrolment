from requests_oauthlib import OAuth1Session
import urllib.parse
import json


class DacoException(Exception):

    def __init__(self, value):
        self.parameter = value

    def __str__(self):
        return repr(self.parameter)


class DacoClient:
    """
    Wrapper class over OAuth1 requests library for communicating with daco.
    """

    SIGNATURE_METHOD = 'PLAINTEXT'
    SIGNATURE_TYPE = 'query'

    def __init__(self, base_url='', client_key='', client_secret='', token='', token_secret=''):
        self.base_url = base_url
        self.auth = OAuth1Session(
            client_key=client_key,
            client_secret=client_secret,
            resource_owner_key=token,
            resource_owner_secret=token_secret,
            signature_type=self.SIGNATURE_TYPE,
            signature_method=self.SIGNATURE_METHOD)

    def get_daco_status(self, email=''):
        """
        Returns the daco status of the given email if daco access exists.
        :param email: The email of the user as a string.
        :return: JSON respnonse from DACO if successful, otherwise raises a DacoException.
        """
        request_url = urllib.parse.urljoin(self.base_url, 'search?entity-type=daco&entity-id={}&expand=details'.format(email))
        response = self.auth.get(request_url)
        if response.status_code == 200:
            return json.loads(response.content)
        else:
            error = {
                'status_code':  response.status_code,
                'message': str(response.content)
            }
            raise DacoException(json.dumps(error))
