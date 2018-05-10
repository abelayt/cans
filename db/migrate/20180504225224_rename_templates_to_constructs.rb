# frozen_string_literal: true

class RenameTemplatesToConstructs < ActiveRecord::Migration[5.2]
  def change
    rename_table :templates, :constructs
  end
end