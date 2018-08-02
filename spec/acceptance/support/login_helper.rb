# frozen_string_literal: true

module LoginHelper
  def login(login_config = default_json)
    visit '/'
    return unless need_login?
    fill_in 'Authorization JSON', with: JSON.generate(login_config)
    click_button 'Sign In'
  end

  private

  def need_login?
    ENV.fetch('CANS_AUTHORIZATION_ENABLED', true) && !page.has_content?('CANS')
  end

  def default_json
    {
      'user': 'RACFID',
      'staffId': '0X5',
      'roles': ['CWS-admin', 'Supervisor'],
      'county_code': '56',
      'county_cws_code': '1123',
      'county_name': 'Ventura',
      'privileges': [
        'CWS Case Management System',
        'Resource Management',
        'Resource Mgmt Placement Facility Maint',
        'Sealed',
        'Sensitive Persons',
        'Snapshot-rollout',
        'Hotline-rollout',
        'Facility-search-rollout',
        'RFA-rollout',
        'development-not-in-use'
      ]
    }
  end
end
