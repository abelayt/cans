# frozen_string_literal: true

require 'rack/proxy'

module Infrastructure
  class ApiProxy < Rack::Proxy
    def perform_request(environment)
      request = Rack::Request.new(environment)
      if request.path.match?(%r{^\/api})
        strip_out_api(request, environment)
      else
        @app.call(environment)
      end
    end

    private

    def strip_out_api(request, environment)
      environment['HTTP_HOST'] = api_host
      environment['rack.url_scheme'] = scheme
      reset_request_path(environment)
      append_token_to_query_params(environment, request)
      call_parent_perform_request_to_avoid_untestable_super(environment)
    end

    def scheme
      Addressable::URI.parse(Rails.configuration.micro_services['cans_api_base_url']).scheme
    end

    def api_host
      cans_api_base_url = Rails.configuration.micro_services['cans_api_base_url']
      uri = Addressable::URI.parse(cans_api_base_url)
      uri_port = uri.port.blank? ? '' : ":#{uri.port}"
      "#{uri.hostname}#{uri_port}"
    end

    def reset_request_path(environment)
      environment['PATH_INFO'] = environment['PATH_INFO'].dup.sub!(%r{^\/api}, '')
    end

    def append_token_to_query_params(environment, request)
      query = environment['QUERY_STRING'] || ''
      query_with_token = "#{query}#{query.blank? ? '' : '&'}token=#{request.session['token']}"
      environment['QUERY_STRING'] = query_with_token
    end

    def call_parent_perform_request_to_avoid_untestable_super(environment)
      Rack::Proxy.instance_method(:perform_request).bind(self).call(environment)
    end
  end
end
