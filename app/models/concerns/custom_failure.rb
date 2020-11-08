class CustomFailure < Devise::FailureApp
	def redirect_url
		flash[:alert] = "auth attempt failed"
		return "/"
	end

	def respond
		if http_auth?
			http_auth
		else
			redirect
		end
	end
end
