# frozen_string_literal: true

require 'acceptance_helper'
require 'feature'
require 'faker'
require 'active_support/time'

feature 'Client Pages' do
  given(:first_name) { Faker::Name.first_name }
  given(:last_name) { Faker::Name.last_name }
  given(:date_of_birth) { Faker::Date.between(20.years.ago, 10.years.ago) }
  given(:case_number) do
    "#{Faker::Number.number(4)}-#{Faker::Number.number(3)}-"\
    "#{Faker::Number.number(4)}-#{Faker::Number.number(8)}"
  end
  given(:client_id) do
    "#{Faker::Number.number(4)}-#{Faker::Number.number(4)}-"\
    "#{Faker::Number.number(4)}-#{Faker::Number.number(7)}"
  end

  scenario 'can add a new client' do
    login
    visit '/clients/new'
    expect(page).to have_content 'Add Child/Youth'

    fill_in('First Name', with: first_name)
    fill_in('Last Name', with: last_name)
    page.find('#dob').set(date_of_birth)
    page.find('#dob').native.send_keys(:up)
    page.find('#dob').native.send_keys(:down)
    fill_in('Case Number', with: case_number)
    fill_in('Client Id', with: client_id)
    find('div[aria-haspopup=true][role=button]').click
    expect(find_button('Save', disabled: true).disabled?).to be true
    find('li', text: 'Fresno').send_keys(:enter)
    click_button 'Save'
    expect(page).to have_content 'Child/Youth Profile'
    expect(page).to have_content first_name
    expect(page).to have_content last_name
    expect(page).to have_content case_number
    expect(page).to have_content client_id
    expect(page).to have_content 'Fresno'
  end

  scenario 'page is accessible' do
    pending('page has accessability issues')
    login
    visit '/clients/new'
    expect(page).to have_content 'Add Child/Youth'
    expect(page).to be_accessible
  end
end
