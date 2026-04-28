==========================================
 EVIDENCE REPORT - 2025-12-07T20:58:14.795677
==========================================

## 1. Backend Unit Tests: SUCCESS
```
============================= test session starts ==============================
platform darwin -- Python 3.10.19, pytest-9.0.1, pluggy-1.6.0
rootdir: /Users/rasec/Documents/github/Proyecto de Tesis/CerebroVial
plugins: anyio-4.11.0, asyncio-1.3.0, hydra-core-1.3.2
asyncio: mode=strict, debug=False, asyncio_default_fixture_loop_scope=None, asyncio_default_test_loop_scope=function
collected 8 items

tests/prediction/test_predictor.py .....                                 [ 62%]
tests/prediction/test_routes.py ...                                      [100%]

=============================== warnings summary ===============================
../../../../../../opt/homebrew/lib/python3.10/site-packages/fastapi/applications.py:1131
  /opt/homebrew/lib/python3.10/site-packages/fastapi/applications.py:1131: PytestCollectionWarning: cannot collect 'test_app' because it is not a function.
    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:

tests/prediction/test_predictor.py::test_get_traffic_history_filtering
  /Users/rasec/Documents/github/Proyecto de Tesis/CerebroVial/src/prediction/application/predictor.py:74: SettingWithCopyWarning: 
  A value is trying to be set on a copy of a slice from a DataFrame.
  Try using .loc[row_indexer,col_indexer] = value instead
  
  See the caveats in the documentation: https://pandas.pydata.org/pandas-docs/stable/user_guide/indexing.html#returning-a-view-versus-a-copy
    df['timestamp'] = df['timestamp'].astype(float)

tests/prediction/test_predictor.py::test_get_traffic_history_filtering
  /Users/rasec/Documents/github/Proyecto de Tesis/CerebroVial/src/prediction/application/predictor.py:75: SettingWithCopyWarning: 
  A value is trying to be set on a copy of a slice from a DataFrame.
  Try using .loc[row_indexer,col_indexer] = value instead
  
  See the caveats in the documentation: https://pandas.pydata.org/pandas-docs/stable/user_guide/indexing.html#returning-a-view-versus-a-copy
    df['datetime'] = df['timestamp'].apply(lambda x: datetime.fromtimestamp(x))

-- Docs: https://docs.pytest.org/en/stable/how-to/capture-warnings.html
======================== 8 passed, 3 warnings in 1.12s =========================

```

## 2. Frontend Unit Tests: SUCCESS
```

> front@0.0.0 test
> vitest run


[1m[46m RUN [49m[22m [36mv4.0.15 [39m[90m/Users/rasec/Documents/github/Proyecto de Tesis/Frontend[39m

 [32m✓[39m src/components/views/__tests__/CameraDetailView.test.tsx [2m([22m[2m5 tests[22m[2m)[22m[32m 56[2mms[22m[39m
[90mstderr[2m | src/components/widgets/__tests__/TrafficHistoryWidget.test.tsx[2m > [22m[2mTrafficHistoryWidget[2m > [22m[2mrenders loading state initially
[22m[39mFailed to fetch history TypeError: Cannot read properties of undefined (reading 'ok')
    at fetchHistory [90m(/Users/rasec/Documents/github/Proyecto de Tesis/Frontend/[39msrc/components/widgets/TrafficHistoryWidget.tsx:62:31[90m)[39m
[90m    at processTicksAndRejections (node:internal/process/task_queues:105:5)[39m
An update to TrafficHistoryWidget inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

 [32m✓[39m src/components/widgets/__tests__/TrafficHistoryWidget.test.tsx [2m([22m[2m3 tests[22m[2m)[22m[32m 32[2mms[22m[39m

[2m Test Files [22m [1m[32m2 passed[39m[22m[90m (2)[39m
[2m      Tests [22m [1m[32m8 passed[39m[22m[90m (8)[39m
[2m   Start at [22m 20:58:16
[2m   Duration [22m 863ms[2m (transform 112ms, setup 125ms, import 409ms, tests 88ms, environment 729ms)[22m


```

## 3. Model Training Metrics: SUCCESS
```
INFO:__main__:Starting Model Training...
INFO:__main__:Loading data logs...
ERROR:src.prediction.infrastructure.csv_loader:Error reading data/traffic_logs/traffic_log_2025-12-06.csv: Error tokenizing data. C error: Expected 14 fields in line 3082, saw 15

INFO:__main__:Loaded 5893 rows of data.
INFO:__main__:Preprocessing and creating targets...
INFO:__main__:Data columns: ['timestamp', 'camera_id', 'street_monitored', 'car_count', 'bus_count', 'truck_count', 'motorcycle_count', 'total_vehicles', 'occupancy_rate', 'flow_rate_per_min', 'avg_speed', 'avg_density', 'zone_id', 'duration_seconds', 'congestion_level', 'hour', 'day_of_week', 'datetime', 'vehicle_types', 'congestion_label', 'target_current', 'target_congestion_15min', 'target_vehicles_15min', 'target_congestion_30min', 'target_vehicles_30min', 'target_congestion_45min', 'target_vehicles_45min']
INFO:__main__:Training 'Current' status model...
INFO:src.prediction.infrastructure.engine:Classifier current Accuracy: 1.00
INFO:src.prediction.infrastructure.engine:Saved model to models/traffic_rf_class_current.joblib
INFO:src.prediction.infrastructure.engine:Regressor current R2 Score: 1.00
INFO:src.prediction.infrastructure.engine:Saved model to models/traffic_rf_reg_current.joblib
INFO:__main__:Training 15min horizon models...
INFO:src.prediction.infrastructure.engine:Classifier 15min Accuracy: 0.82
INFO:src.prediction.infrastructure.engine:Saved model to models/traffic_rf_class_15min.joblib
INFO:src.prediction.infrastructure.engine:Regressor 15min R2 Score: 0.82
INFO:src.prediction.infrastructure.engine:Saved model to models/traffic_rf_reg_15min.joblib
INFO:__main__:Training 30min horizon models...
INFO:src.prediction.infrastructure.engine:Classifier 30min Accuracy: 0.81
INFO:src.prediction.infrastructure.engine:Saved model to models/traffic_rf_class_30min.joblib
INFO:src.prediction.infrastructure.engine:Regressor 30min R2 Score: 0.86
INFO:src.prediction.infrastructure.engine:Saved model to models/traffic_rf_reg_30min.joblib
INFO:__main__:Training 45min horizon models...
INFO:src.prediction.infrastructure.engine:Classifier 45min Accuracy: 0.84
INFO:src.prediction.infrastructure.engine:Saved model to models/traffic_rf_class_45min.joblib
INFO:src.prediction.infrastructure.engine:Regressor 45min R2 Score: 0.86
INFO:src.prediction.infrastructure.engine:Saved model to models/traffic_rf_reg_45min.joblib
INFO:__main__:Training Complete. Models saved to ./models/

```
