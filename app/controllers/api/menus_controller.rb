class Api::MenusController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :authenticate_token, except: [:index]
  
  def index
    if params[:category_id].present?
      menus = Menu.where(category_id: params[:category_id]).order(:position)
    else
      menus = Menu.joins(:category).order("categories.position, menus.position")
    end
    render json: menus
  end
  
  def create
    if session[:user_id].present?
      # order_id, menu_name = OrderEngine.order(session[:order_id], session[:user_id], params[:menu_id], params[:quantity] )
      
      order_machine = OrderMachine.new(session[:order_id], session[:user_id], params[:menu_id], params[:quantity] )
      
      order_machine.ordering
      
      session[:order_id] = order_machine.order.id
  
      message = "You have just order #{order_machine.menu.name}"
     
    else
      message = "Please sign in first before continue"
    end
    render json: { message: message }
  end
  
  private
  
  def authenticate_token
    unless session[:user_id].present?
      message = {}
      message[:notice] = "Please sign in first"
      render json: message, status: 401
    end
  end
end