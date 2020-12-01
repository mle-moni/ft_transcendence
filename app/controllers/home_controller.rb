class HomeController < ApplicationController
  def index
    if current_user
      @name = current_user.nickname
      @href = "#profile"
      @superAdmin = current_user.admin ? true : false;
    else
      @name = "Sign in"
      @href = "#"
    end
  end
end
