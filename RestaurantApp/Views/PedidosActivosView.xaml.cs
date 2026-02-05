// RestaurantApp/Views/PedidosActivosView.xaml.cs
using RestaurantApp.ViewModels;

namespace RestaurantApp.Views
{
    public partial class PedidosActivosView : ContentPage
    {
        private PedidosActivosViewModel _viewModel;

        public PedidosActivosView()
        {
            InitializeComponent();
            _viewModel = new PedidosActivosViewModel();
            BindingContext = _viewModel;
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();

            _ = _viewModel.CargarPedidos();

            // Iniciar actualizaci\xf3n autom\xe1tica
            _viewModel.IniciarActualizacionAutomatica();

            System.Diagnostics.Debug.WriteLine("[PedidosActivosView] Vista apareci\xf3 - Recargando pedidos");
        }

        protected override void OnDisappearing()
        {
            base.OnDisappearing();
            _viewModel.DetenerActualizacionAutomatica();
        }
    }
}