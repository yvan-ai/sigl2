import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Carousel from '../components/Carousel';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Création d'un mock pour axios
const mockAxios = new MockAdapter(axios);

describe('Carousel', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  test('renders event cards correctly', async () => {
    // Mock de la réponse de l'API
    mockAxios.onGet('http://127.0.0.1:8000/evenement/upcoming-events/').reply(200, [
      {
        id: 1,
        intitulé: 'Event 1',
        adresse: '123 Main St',
        image: '/images/event1.jpg',
        date: '2025-01-01',
        heure: '12:00',
        description: 'Description of Event 1',
      },
      {
        id: 2,
        intitulé: 'Event 2',
        adresse: '456 Another St',
        image: '/images/event2.jpg',
        date: '2025-01-02',
        heure: '14:00',
        description: 'Description of Event 2',
      },
    ]);

    render(<Carousel />);

    // Attendre que les événements soient chargés
    await waitFor(() => expect(screen.getByText('Event 1')).toBeInTheDocument());

    // Vérifier que les cartes d'événements sont bien affichées
    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('Event 2')).toBeInTheDocument();
  });

  test('displays error message when no events are fetched', async () => {
    // Mock de l'échec de l'API
    mockAxios.onGet('http://127.0.0.1:8000/evenement/upcoming-events/').reply(500);

    render(<Carousel />);

    // Attendre que l'erreur soit affichée
    await waitFor(() => expect(screen.getByText('Vous devez être connecté pour voir les événements.')).toBeInTheDocument());
  });

  test('opens modal with event details when clicking an event', async () => {
    // Mock de la réponse de l'API
    mockAxios.onGet('http://127.0.0.1:8000/evenement/upcoming-events/').reply(200, [
      {
        id: 1,
        intitulé: 'Event 1',
        adresse: '123 Main St',
        image: '/images/event1.jpg',
        date: '2025-01-01',
        heure: '12:00',
        description: 'Description of Event 1',
      },
    ]);

    render(<Carousel />);

    // Attendre que l'événement soit affiché
    await waitFor(() => expect(screen.getByText('Event 1')).toBeInTheDocument());

    // Cliquer sur l'image de l'événement pour ouvrir le modal
    userEvent.click(screen.getByAltText('Event 1'));

    // Vérifier si les détails du modal sont affichés
    expect(screen.getByText('Date : 2025-01-01')).toBeInTheDocument();
    expect(screen.getByText('Heure : 12:00')).toBeInTheDocument();
    expect(screen.getByText('Adresse : 123 Main St')).toBeInTheDocument();
    expect(screen.getByText('Description : Description of Event 1')).toBeInTheDocument();
  });

  test('closes modal when close button is clicked', async () => {
    // Mock de la réponse de l'API
    mockAxios.onGet('http://127.0.0.1:8000/evenement/upcoming-events/').reply(200, [
      {
        id: 1,
        intitulé: 'Event 1',
        adresse: '123 Main St',
        image: '/images/event1.jpg',
        date: '2025-01-01',
        heure: '12:00',
        description: 'Description of Event 1',
      },
    ]);

    render(<Carousel />);

    // Attendre que l'événement soit affiché
    await waitFor(() => expect(screen.getByText('Event 1')).toBeInTheDocument());

    // Cliquer sur l'image pour ouvrir le modal
    userEvent.click(screen.getByAltText('Event 1'));

    // Vérifier que le modal est ouvert
    expect(screen.getByText('Date : 2025-01-01')).toBeInTheDocument();

    // Cliquer sur le bouton de fermeture
    userEvent.click(screen.getByText('×'));

    // Vérifier que le modal est fermé
    expect(screen.queryByText('Date : 2025-01-01')).not.toBeInTheDocument();
  });

  test('toggles reminder state when switch is clicked', async () => {
    // Mock de la réponse de l'API
    mockAxios.onGet('http://127.0.0.1:8000/evenement/upcoming-events/').reply(200, [
      {
        id: 1,
        intitulé: 'Event 1',
        adresse: '123 Main St',
        image: '/images/event1.jpg',
        date: '2025-01-01',
        heure: '12:00',
        description: 'Description of Event 1',
      },
    ]);

    render(<Carousel />);

    // Attendre que l'événement soit affiché
    await waitFor(() => expect(screen.getByText('Event 1')).toBeInTheDocument());

    // Vérifier que le switch est initialement désactivé
    expect(screen.getByText('Désactivé')).toBeInTheDocument();

    // Cliquer sur le switch pour activer le rappel
    userEvent.click(screen.getByRole('button', { name: /switch/i }));

    // Vérifier que le switch est activé
    expect(screen.getByText('Activé')).toBeInTheDocument();
  });
});
