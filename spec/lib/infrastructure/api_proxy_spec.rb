# frozen_string_literal: true

require 'rails_helper'

module Infrastructure
  describe ApiProxy do
    describe '#perform_request' do
      context 'for a request with /api' do
        let(:proxy) { instance_double('Rack::Proxy') }
        let(:application) { Infrastructure::ApiProxy.new(proxy, {}) }

        before do
          allow(proxy).to receive(:call)
          # this is an unfortunate mocking of the Class under test due to issues
          # with the network calls done by Rack::Proxy that I was unable to mock
          # even webmock/fakeweb do not work see (https://github.com/ncr/rack-proxy)
          allow(application).to receive(:call_parent_perform_request_to_avoid_untestable_super)
        end

        context 'with extra params' do
          let(:environment) do
            {
              'REQUEST_METHOD' => 'GET',
              'PATH_INFO' => '/api',
              'REQUEST_PATH' => '/api',
              'QUERY_STRING' =>  'myparam=stuff',
              'rack.session' => { 'token' => 'some_token' }
            }
          end

          it 'passes the request with & between params' do
            expect(application).to receive(:call_parent_perform_request_to_avoid_untestable_super)
              .with(
                hash_including('rack.url_scheme' => 'https',
                               'HTTP_HOST' => 'cans-api.test:8080',
                               'PATH_INFO' => '',
                               'QUERY_STRING' => 'myparam=stuff&token=some_token')
              )

            application.perform_request(environment)
          end
        end

        context 'without extra params' do
          let(:environment) do
            {
              'REQUEST_METHOD' => 'GET',
              'PATH_INFO' => '/api',
              'REQUEST_PATH' => '/api',
              'QUERY_STRING' => '',
              'rack.session' => { 'token' => 'some_token' }
            }
          end

          it 'passes the request without extra &' do
            expect(application).to receive(:call_parent_perform_request_to_avoid_untestable_super)
              .with(
                hash_including('rack.url_scheme' => 'https',
                               'HTTP_HOST' => 'cans-api.test:8080',
                               'PATH_INFO' => '',
                               'QUERY_STRING' => 'token=some_token')
              )
            application.perform_request(environment)
          end
        end

        context 'without a port number in the cans api' do
          let(:environment) do
            {
              'REQUEST_METHOD' => 'GET',
              'PATH_INFO' => '/api',
              'REQUEST_PATH' => '/api',
              'QUERY_STRING' => '',
              'rack.session' => { 'token' => 'some_token' }
            }
          end
          let(:config_without_port) { { 'cans_api_base_url' => 'http://example.org' } }

          it 'passes the request without extra &' do
            allow(Rails).to receive_message_chain(:configuration, :micro_services)
              .and_return(config_without_port)
            expect(application).to receive(:call_parent_perform_request_to_avoid_untestable_super)
              .with(
                hash_including('rack.url_scheme' => 'http',
                               'HTTP_HOST' => 'example.org',
                               'PATH_INFO' => '',
                               'QUERY_STRING' => 'token=some_token')
              )
            application.perform_request(environment)
          end
        end
      end

      context 'for a request without /api' do
        let(:proxy) { instance_double('Rack::Proxy') }
        let(:application) { Infrastructure::ApiProxy.new(proxy, {}) }

        it 'just passes along request without change' do
          expect(proxy).to receive(:call).with({})
          application.perform_request({})
        end
      end
    end
  end
end
