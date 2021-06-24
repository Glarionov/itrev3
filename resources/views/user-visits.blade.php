@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8 user-visits">
            <h1>Unique user visits data</h1>
            <hr>
            <p class="user-visits__loading">
                Loading...
            </p>
            <div class="user-visits__success d-none">
                <div class="user-visits__canvases">
                    <h2>By hour</h2>
                    <canvas class="user-visits__visits-by-hour"></canvas>
                    <hr>
                    <h2>By city</h2>
                    <canvas class="user-visits__visits-by-city"></canvas>
                </div>
            </div>
            <div class="user-visits__error alert d-none"></div>
        </div>
    </div>
</div>

@endsection
