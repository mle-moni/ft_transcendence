Rails.application.routes.draw do

  get 'home/index'
  root "home#index"

  # sign in route:
  devise_for :users, controllers: { omniauth_callbacks: "users/omniauth_callbacks" }

  # sign out route:
  devise_scope :user do
    delete 'sign_out', :to => 'devise/sessions#destroy', :as => :destroy_user_session_path
  end

  resources :posts
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
