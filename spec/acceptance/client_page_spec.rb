# frozen_string_literal: true

require 'acceptance_helper'
require 'feature'
require 'faker'
require 'active_support/time'

feature 'Client Pages' do
  given(:first_name) { Faker::Name.first_name }
  given(:last_name) { Faker::Name.last_name }
  given(:date_of_birth) { Faker::Date.between(20.years.ago, 10.years.ago) }
  given(:case_number) { Faker::Number.number(10) }

  scenario 'can add a new client' do
    login
    visit '/clients/new'
    expect(page).to have_content 'Add Child/Youth'

    fill_in('First Name', with: '')
    click_button('Save')
    expect(page).to have_content 'Add Child/Youth'

    fill_in('First Name', with: first_name)
    fill_in('Last Name', with: last_name)
    page.find('#dob').set(date_of_birth)
    fill_in('Case Number', with: case_number)
    find('div[aria-haspopup=true][role=button]').click
    find('li', text: 'Fresno').send_keys(:enter)
    click_button 'Save'
    expect(page).to have_content 'Child/Youth Profile'
    expect(page).to have_content first_name
    expect(page).to have_content last_name
    expect(page).to have_content case_number
    expect(page).to have_content 'Fresno'
  end
end