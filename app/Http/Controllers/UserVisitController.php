<?php

namespace App\Http\Controllers;

use App\Models\UserVisit;
use Illuminate\Http\Request;
use App\Helpers\ApiCode;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use MarcinOrlowski\ResponseBuilder\ResponseBuilder as RB;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Database\QueryException;
use MarcinOrlowski\ResponseBuilder\Exceptions\ArrayWithMixedKeysException;
use MarcinOrlowski\ResponseBuilder\Exceptions\ConfigurationNotFoundException;
use MarcinOrlowski\ResponseBuilder\Exceptions\IncompatibleTypeException;
use MarcinOrlowski\ResponseBuilder\Exceptions\InvalidTypeException;
use MarcinOrlowski\ResponseBuilder\Exceptions\MissingConfigurationKeyException;
use MarcinOrlowski\ResponseBuilder\Exceptions\NotIntegerException;

class UserVisitController extends Controller
{
    /**
     * Сохраняет данные о посещении пользователем сайта
     *
     * @param Request $request
     * @return Response
     * @throws InvalidTypeException
     * @throws NotIntegerException
     * @throws IncompatibleTypeException
     * @throws ConfigurationNotFoundException
     * @throws ArrayWithMixedKeysException
     * @throws MissingConfigurationKeyException
     */
    public function create(Request $request): Response
    {
        $postData = $request->validate([
            'ip' => ['required', 'string'],
            'device' => ['string'],
            'city' => ['string']
        ]);

        $UserVisit = new UserVisit();

        $UserVisit->ip = $postData['ip'];
        $UserVisit->device = $postData['device'];
        $UserVisit->city = $postData['city'];
        $UserVisit->save();

        if ($UserVisit->id) {
            return RB::success(['id' => $UserVisit->id]);
        } else {
            return RB::error(ApiCode::INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Получает информацию об уникальных посещениях сайта по кажодму городу
     * @return false|Collection
     */
    public function getUniqueVisitsByCity()
    {
        try {
            $uniqueVisits = DB::table('user_visits')
                ->select('city', DB::raw('count(DISTINCT ip) as unique_visits'))
                ->groupBy('city')
                ->get();
        } catch(QueryException $exception) {
            Log::error($exception->getMessage());
            return false;
        }
        return $uniqueVisits;
    }

    /**
     * Получает информацию об уникальных посещениях сайта по кажодму часу
     * @return false|Collection
     */
    public function getUniqueVisitsByHour()
    {
        try {
            $uniqueVisits = DB::table('user_visits')
                ->select(DB::raw('hour(created_at) as visit_hour'), DB::raw('count(DISTINCT ip) as unique_visits'))
                ->groupBy('visit_hour')
                ->get()
                ->keyBy('visit_hour');
        } catch(QueryException $exception){
            Log::error($exception->getMessage());
            return false;
        }
        return $uniqueVisits;
    }

    /**
     * Получает информацию об уникальных посещениях сайта по кажодму городу
     * @throws InvalidTypeException
     * @throws NotIntegerException
     * @throws ArrayWithMixedKeysException
     * @throws MissingConfigurationKeyException
     * @throws IncompatibleTypeException
     * @throws ConfigurationNotFoundException
     */
    public function getUniqueVisits(): Response
    {
        $visitsByCity = $this->getUniqueVisitsByCity();
        if ($visitsByCity === false) {
            return RB::error(ApiCode::INTERNAL_SERVER_ERROR);
        }
        $visitsByHour = $this->getUniqueVisitsByHour();

        if ($visitsByHour === false) {
            return RB::error(ApiCode::INTERNAL_SERVER_ERROR);
        }

        return RB::success(['by_city' => $visitsByCity, 'by_hour' => $visitsByHour]);
    }
}
