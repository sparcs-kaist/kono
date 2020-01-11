# Reference: https://github.com/codecraf8/python-rest-api-aiohttp

import inspect
import json

from aiohttp.web import Request, Response
from aiohttp.http_exceptions import HttpBadRequest
from aiohttp.web_exceptions  import HTTPMethodNotAllowed

from data import Datadump

DEFAULT_METHODS = ('GET', 'POST', 'PUT', 'DELETE')

class RestEndPoint:
    def __init__(self):
        self.methods = {}
        for method_name in DEFAULT_METHODS:
            method = getattr(self, method_name.lower(), None)
            if method:
                self.register_method(method_name, method)
    
    def register_method(self, method_name, method):
        self.methods[method_name.upper()] = method
    
    async def dispatch(self, request):
        method = self.methods.get(request.method.upper())

        if not method:
            raise HTTPMethodNotAllowed('', DEFAULT_METHODS)

        wanted_args = list(inspect.signature(method).parameters.keys())
        available_args = request.match_info.copy()
        available_args.update({'request': request})

        unsatisfied_args = set(wanted_args) - set(available_args.keys())
        if unsatisfied_args:
            # Expected match info that doesn't exist
            raise HttpBadRequest('')

        return await method(**{arg_name: available_args[arg_name] for arg_name in wanted_args})

class DataEndpoint(RestEndPoint):
    def __init__(self, datadump):
        super().__init__()
        self.datadump = datadump

    async def get(self, request):

        try:
            device_id = int(request.match_info['device_id'])
            if 'recent' not in request.rel_url.query:
                raise Exception('recent')
            recent    = request.rel_url.query['recent']
            return Response(
                status=200, content_type='application/json',
                body=json.dumps(self.datadump.get(device_id, recent))
            )

        except ValueError:
            return Response(
                status=400, content_type='text/plain',
                body='invalid path parameter \"device_id\"'
            )

        except Exception as e:
            msg = e.args[0]
            if msg == 'device_id':
                return Response(
                    status=404, content_type='text/plain',
                    body='device does not exist'
                )
            elif msg == 'recent':
                return Response(
                    status=400, content_type='text/plain',
                    body='invalid query parameter \"recent\"'
                )

class DeviceEndPoint(RestEndPoint):
    async def get(self, request):
        return Response(
                status=200, content_type='application/json',
                body=json.dumps(judge.get_device_ids())
            )

class Router:
    def __init__(self, datadump):
        self.data_endpoint = DataEndpoint(datadump)
        self.device_endpoint = DeviceEndPoint()

    def register(self, router):
        # Add routes for methods other than OPTIONS (CORS preflight handled by aiohttp_cors)
        for method in ('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'):
            router.add_route(method, '/device_ids', self.device_endpoint.dispatch)
            router.add_route(method, '/{device_id}', self.data_endpoint.dispatch)

import judge