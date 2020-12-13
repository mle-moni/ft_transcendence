Rails.application.routes.draw do
 
  # home page
  root "home#index"

  scope "api" do
    # guild actions
    resources :guilds
    post '/guild/join', to: 'guilds#join'
    post '/guild/quit', to: 'guilds#quit'
    post '/guild/promote', to: 'guilds#promote'
    post '/guild/demote', to: 'guilds#demote'
    post '/guild/accept', to: 'guilds#accept_request'
    post '/guild/reject', to: 'guilds#reject_request'
    post '/wars/create', to: 'wars#create'
    post '/wars/delete', to: 'wars#delete'
    post '/wars/validate', to: 'wars#validate'
    post '/wars/update', to: 'wars#update'
    post '/wars/create_war_time', to: 'wars#create_war_time'
    post '/wars/delete_war_time', to: 'wars#delete_war_time'
    post '/wars/match_request', to: 'wars#match_request'

    # Tournaments actions
    get '/tournaments', to: 'tournaments#index'
    post '/tournaments', to: 'tournaments#create'
    delete '/tournaments/:id', to: 'tournaments#destroy'
    get '/tournaments/:id', to: 'tournaments#show'
    get '/tournaments/register/:id', to: 'tournaments#register'
    get '/tournaments/unregister/:id', to: 'tournaments#unregister'

    get '/games/:room_id/:user_id', to: 'games#is_connected'

    # CHAT & DMS ------
    resources :rooms do 
      resources :members, controller: 'room/members', only: [:index, :new, :create, :destroy]
      resources :admins, controller: 'room/admins',  only: [:index, :new, :create, :destroy]
    end 
    resources :room_messages
    post '/rooms/joinPublic', to: 'rooms#joinPublic'
    post '/rooms/joinPrivate', to: 'rooms#joinPrivate'
    post '/rooms/quit', to: 'rooms#quit'
    post '/rooms/mute', to: 'rooms_administrate#mute'
    post '/rooms/unmute', to: 'rooms_administrate#unmute'
    post '/rooms/ban', to: 'rooms_administrate#ban'
    post '/rooms/unban', to: 'rooms_administrate#unban'
    post '/rooms/kick', to: 'rooms_administrate#kick'

    post '/rooms/promoteAdmin', to: 'rooms#promoteAdmin'
    post '/rooms/demoteAdmin', to: 'rooms#demoteAdmin'

    post '/rooms/createDuelRequest', to: 'rooms#createDuelRequest'
    post '/rooms/acceptDuelRequest', to: 'rooms#acceptDuelRequest'

    post '/handleBlock', to: 'profile#handleBlock'

    resources :direct_chats
    resources :chat_messages
    
    post '/direct_chats/createDuelRequest', to: 'direct_chats#createDuelRequest'
    post '/direct_chats/acceptDuelRequest', to: 'direct_chats#acceptDuelRequest'

    # ------
    
    # friends actions
    post '/friends/add'
    post '/friends/accept'
    post '/friends/reject'
    post '/friends/destroy'
    post '/friends/get_all'
    post '/friends/last_seen'
    # profile actions
    post 'profile/get'
    # admin actions
    post 'admin/ban'
    post 'admin/unban'
    post 'admin/promote'
    post 'admin/demote'
  end

  # profile actions, I might move it to the API scope
  post '/profile/edit', to: 'profile#update'
  post '/profile/password', to: 'profile#change_password'
  post 'profile/enable_otp'
  post 'profile/disable_otp'
  post '/profile/first_time'

  # sign in route:
  devise_for :users, controllers: { omniauth_callbacks: "users/omniauth_callbacks" }

  # sign out route:
  devise_scope :user do
    delete 'sign_out', :to => 'devise/sessions#destroy', :as => :destroy_user_session_path
  end

  match "*path", to: "application#page_not_found", :via => [:get, :post, :delete, :put, :patch]

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
